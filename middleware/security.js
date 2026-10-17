"use strict";

const { stats } = require("./stats");

// Strict Attack Patterns for Active Firewall Blocking
const BLOCKABLE_ATTACK_PATTERNS = [
  {
    name: "SQL Injection",
    re: /('\s*(or|and|union|select|insert|drop|update|delete|--)|union\s+select|drop\s+table|\/\*[\s\S]*?\*\/|xp_\w+|exec\s*\()/i,
  },
  {
    name: "Path Traversal",
    re: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c|%2e%2e\/|\.\.%2f)/i,
  },
  {
    name: "Command Injection",
    re: /[|`]|;\s*(ls|cat|wget|curl|bash|sh|rm|chmod|chown|python|perl|ruby)\b/i,
  },
  {
    name: "Null Byte Injection",
    re: /(%00|\x00|\\0)/i,
  },
];

// Internal or file upload paths to exclude from strict body pattern matching
const EXCLUDED_PATHS = new Set(["/", "/health", "/favicon.ico"]);

/**
 * Active Web Application Firewall (WAF) Middleware
 * Scans incoming request URLs, query strings, and payload bodies to block malicious exploits before reaching database queries.
 */
function activeWafMiddleware(req, res, next) {
  if (EXCLUDED_PATHS.has(req.path)) {
    return next();
  }

  // Scan URL and Query parameters
  const queryStr = JSON.stringify(req.query || {});
  const bodyStr = req.body && typeof req.body === "object" ? JSON.stringify(req.body) : "";
  const scanTarget = `${req.originalUrl || req.url} ${queryStr} ${bodyStr}`;

  for (const pattern of BLOCKABLE_ATTACK_PATTERNS) {
    if (pattern.re.test(scanTarget)) {
      const clientIp = req.ip || req.connection?.remoteAddress || req.headers["x-forwarded-for"] || "unknown";
      
      // Record attack in stats
      if (stats && Array.isArray(stats.attacks)) {
        stats.attacks.unshift({
          time: new Date().toISOString(),
          type: pattern.name,
          ip: clientIp,
          method: req.method,
          path: req.originalUrl || req.url,
          blocked: true,
        });
        if (stats.attacks.length > 50) stats.attacks.pop();
      }

      console.warn(`[SECURITY WAF] Blocked ${pattern.name} from IP: ${clientIp} on ${req.method} ${req.originalUrl}`);

      return res.status(403).json({
        success: false,
        message: "Forbidden: Security policy violation detected and blocked by Application Firewall.",
        violation: pattern.name,
      });
    }
  }

  next();
}

/**
 * HTTP Parameter Pollution (HPP) Guard
 * Prevents array poisoning where single values are expected (e.g. ?page=1&page=2), preventing ORM crashes.
 */
function hppGuard(req, res, next) {
  if (req.query && typeof req.query === "object") {
    const singleParamKeys = ["page", "limit", "sort", "sortBy", "order", "status", "search", "category", "level", "format"];
    for (const key of singleParamKeys) {
      if (Array.isArray(req.query[key])) {
        // Take the last item in the array
        req.query[key] = req.query[key][req.query[key].length - 1];
      }
    }
  }
  next();
}

module.exports = {
  activeWafMiddleware,
  hppGuard,
};
