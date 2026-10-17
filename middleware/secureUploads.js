"use strict";

const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const UPLOAD_ROOT = path.resolve(__dirname, "../public/uploads");

// Folders containing sensitive/confidential records
const SENSITIVE_FOLDERS = ["payments", "documents", "contracts", "private", "resumes", "invoices"];

// Allowed origins for anti-hotlinking
const ALLOWED_ORIGIN_PATTERNS = [
  env.CLIENT_URL,
  env.ADMIN_URL,
  "kkitbd.com",
  "admin.kkitbd.com",
  "localhost:4000",
  "localhost:4001",
  "localhost:3000",
  "localhost:5000",
  "capacitor://localhost",
];

/**
 * Extract auth token from Header, Cookies, or Query Param
 */
function extractToken(req) {
  // 1. Authorization header: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }

  // 2. Cookie authentication
  if (req.cookies) {
    if (req.cookies.admin_accessToken) return req.cookies.admin_accessToken;
    if (req.cookies.client_accessToken) return req.cookies.client_accessToken;
  }

  // 3. Query string token (for embedded images / direct document views)
  if (req.query && req.query.token) {
    return req.query.token;
  }

  return null;
}

/**
 * Verify if request originates from our authorized web apps
 */
function isAuthorizedOrigin(req) {
  // Always permit in development if no referer/origin provided (e.g. local inspection)
  const isDev = process.env.NODE_ENV !== "production";

  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";
  const secFetchSite = req.headers["sec-fetch-site"];

  // If no origin and no referer (direct curl/browser url in dev)
  if (!origin && !referer) {
    return isDev;
  }

  // Check against allowed origins & referers
  const checkStr = `${origin} ${referer}`.toLowerCase();
  for (const pattern of ALLOWED_ORIGIN_PATTERNS) {
    if (pattern && checkStr.includes(pattern.toLowerCase())) {
      return true;
    }
  }

  // If modern browser indicates same-origin or same-site
  if (secFetchSite === "same-origin" || secFetchSite === "same-site") {
    return true;
  }

  return false;
}

/**
 * Secure Uploads Middleware
 * Enforces:
 * 1. Path traversal defense
 * 2. Mandatory authentication for sensitive folders (payments, documents, private)
 * 3. Anti-hotlinking shield so external websites cannot steal or link your files
 */
function secureUploadsHandler(req, res, next) {
  // Only handle GET and HEAD requests for file delivery
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ success: false, message: "Method not allowed for uploads" });
  }

  // Clean relative path
  const reqPath = decodeURIComponent(req.path || "/").replace(/^\/+/, "");

  // Prevent path traversal attempts
  if (reqPath.includes("..") || reqPath.includes("\0") || reqPath.includes("\\")) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Invalid file path",
    });
  }

  // Normalize absolute disk path
  const absoluteFilePath = path.join(UPLOAD_ROOT, reqPath);

  // Ensure file stays strictly inside UPLOAD_ROOT
  if (!absoluteFilePath.startsWith(UPLOAD_ROOT)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Access out of bounds",
    });
  }

  // Determine top folder
  const pathParts = reqPath.split("/");
  const topFolder = (pathParts[0] || "").toLowerCase();
  const isSensitive = SENSITIVE_FOLDERS.includes(topFolder);

  // ─── 1. SENSITIVE FOLDER AUTHENTICATION ─────────────────────────────────────
  if (isSensitive) {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Active authentication required to access confidential files.",
        folder: topFolder,
      });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
      }

      // Attach decoded user info
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === "TokenExpiredError" ? "Unauthorized: Token expired" : "Unauthorized: Invalid authentication",
      });
    }
  }

  // ─── 2. WEB-ONLY ANTI-HOTLINKING SHIELD ─────────────────────────────────────
  // If not sensitive, check that the request is from our authorized web apps
  if (!isSensitive && !isAuthorizedOrigin(req)) {
    // If request has valid auth token, allow it anyway
    const token = extractToken(req);
    let hasValidToken = false;
    if (token) {
      try {
        jwt.verify(token, env.JWT_SECRET);
        hasValidToken = true;
      } catch {
        hasValidToken = false;
      }
    }

    if (!hasValidToken && process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: External hotlinking and unauthorized scrapers are blocked.",
      });
    }
  }

  // ─── 3. FILE EXISTENCE & SECURE SERVING ──────────────────────────────────────
  fs.stat(absoluteFilePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Set secure response headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    
    // Sensitive files must not be cached by public intermediate proxies
    if (isSensitive) {
      res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    } else {
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    }

    // Stream file securely
    res.sendFile(absoluteFilePath);
  });
}

module.exports = {
  secureUploadsHandler,
  SENSITIVE_FOLDERS,
};
