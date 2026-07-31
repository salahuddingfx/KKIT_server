"use strict";

const { logActivity } = require("../modules/audit-log/audit-log.service");

// Routes that don't need continuous page_view logging
const SKIP_PATHS = new Set([
  "/favicon.ico",
  "/api/v1/health",
  "/sw.js",
  "/robots.txt",
  "/sitemap.xml",
]);

/**
 * Middleware to record visitor activity and audit logs
 */
function auditMiddleware(req, res, next) {
  if (SKIP_PATHS.has(req.path)) return next();

  // Log on response finish
  res.on("finish", () => {
    // Only log non-static or API / page routes
    if (req.method === "OPTIONS") return;

    let action = `${req.method}_${req.path}`;
    let category = "visitor";

    if (req.path.startsWith("/api/v1/auth")) {
      category = "auth";
      action = req.path.includes("login") ? "LOGIN" : req.path.includes("register") ? "REGISTER" : "AUTH_ACTIVITY";
    } else if (req.path.startsWith("/api/v1/payments")) {
      category = "payment";
      action = "PAYMENT_ACTIVITY";
    } else if (req.path.startsWith("/api/v1/contact") || req.path.startsWith("/api/v1/careers")) {
      category = "lead";
      action = "LEAD_ACTIVITY";
    } else if (req.path.startsWith("/api/v1/admin") || req.path.startsWith("/api/v1/dashboard")) {
      category = "admin";
      action = "ADMIN_ACTIVITY";
    }

    const status = res.statusCode >= 400 ? (res.statusCode >= 500 ? "error" : "warning") : "info";

    // Non-blocking log recording
    logActivity(
      req,
      res,
      action,
      category,
      {
        query: req.query,
        bodyKeys: req.body ? Object.keys(req.body) : [],
      },
      status
    ).catch(() => {});
  });

  next();
}

module.exports = { auditMiddleware };
