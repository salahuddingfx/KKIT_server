"use strict";

// ─── In-memory stats store ────────────────────────────────────────────────────
const stats = {
  startTime:    Date.now(),
  totalReqs:    0,
  activeReqs:   0,
  statusCounts: {},   // { "200": 5, "404": 2, ... }
  recentReqs:   [],   // last 50 requests
  attacks:      [],   // detected suspicious requests
  errors:       [],   // 5xx errors
};

const MAX_RECENT  = 50;
const MAX_ATTACKS = 30;
const MAX_ERRORS  = 30;

// ─── Attack / suspicious pattern detection ────────────────────────────────────
const ATTACK_PATTERNS = [
  // Require SQL keyword context — not just a bare ' or ;
  { name: "SQL Injection",     re: /('\s*(or|and|union|select|insert|drop|update|delete|--)|union\s+select|drop\s+table|\/\*[\s\S]*?\*\/|xp_\w+|exec\s*\()/i },
  { name: "XSS",               re: /<script[\s>]|javascript:\s*[^\s]|on(load|error|click|mouse\w+)\s*=/i },
  { name: "Path Traversal",    re: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/i },
  // Require shell command context in URL/body — not in UA
  { name: "Command Injection", re: /[|`]|;\s*(ls|cat|wget|curl|bash|sh|rm|chmod|chown|python|perl|ruby)\b/i },
  // Only flag SSRF when it appears in a URL param or body path — not in IP field
  { name: "SSRF",              re: /(https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|169\.254\.|::1))/i },
];

// ─── Routes to skip attack detection (internal/dashboard) ───────────────────
const SKIP_ATTACK_PATHS = new Set(["/", "/health", "/favicon.ico"]);

function detectAttack(req) {
  if (SKIP_ATTACK_PATHS.has(req.path)) return null;

  // Only scan controllable input — NOT the User-Agent header
  const targets = [
    req.url,
    JSON.stringify(req.query),
    JSON.stringify(req.body || {}),
  ].join(" ");

  for (const p of ATTACK_PATTERNS) {
    if (p.re.test(targets)) return p.name;
  }
  return null;
}

// ─── Middleware ───────────────────────────────────────────────────────────────
function statsMiddleware(req, res, next) {
  const start = Date.now();
  stats.totalReqs++;
  stats.activeReqs++;

  // Attack check
  const attack = detectAttack(req);
  if (attack) {
    stats.attacks.unshift({
      time:   new Date().toISOString(),
      type:   attack,
      ip:     req.ip || req.connection?.remoteAddress || "unknown",
      method: req.method,
      path:   req.path,
    });
    if (stats.attacks.length > MAX_ATTACKS) stats.attacks.pop();
  }

  res.on("finish", () => {
    const dur  = Date.now() - start;
    const code = String(res.statusCode);
    stats.activeReqs = Math.max(0, stats.activeReqs - 1);
    stats.statusCounts[code] = (stats.statusCounts[code] || 0) + 1;

    const entry = {
      time:   new Date().toISOString(),
      method: req.method,
      path:   req.path,
      status: res.statusCode,
      ms:     dur,
      ip:     req.ip || "unknown",
    };

    stats.recentReqs.unshift(entry);
    if (stats.recentReqs.length > MAX_RECENT) stats.recentReqs.pop();

    if (res.statusCode >= 500) {
      stats.errors.unshift({ ...entry });
      if (stats.errors.length > MAX_ERRORS) stats.errors.pop();
    }
  });

  next();
}

module.exports = { statsMiddleware, stats };