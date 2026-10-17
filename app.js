const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/cors");
const env = require("./config/env");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const routes = require("./routes/index");
const { statsMiddleware } = require("./middleware/stats");
const { auditMiddleware } = require("./middleware/audit.middleware");
const { activeWafMiddleware, hppGuard } = require("./middleware/security");
const renderDashboard = require("./utils/dashboard");

const app = express();

// Disable Express fingerprint
app.disable("x-powered-by");

// Stats tracker & Audit Log tracker (must be first)
app.use(statsMiddleware);
app.use(auditMiddleware);


// Security & CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);
app.use(cors(corsOptions));

const { secureUploadsHandler } = require("./middleware/secureUploads");

// Secure upload handler: Authentication for sensitive folders & Web-Only Anti-Hotlinking
app.use("/uploads", cookieParser(), secureUploadsHandler);

// Dashboard — served before rate limiter so it's always accessible
app.get("/", renderDashboard);

// Rate limiting (60 requests per minute per IP)
app.use("/api/v1", apiLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Parameter pollution guard & Active WAF protection
app.use(hppGuard);
app.use(activeWafMiddleware);

// Compression
app.use(compression());

// Logging
if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (req, res) => {
  const { stats } = require("./middleware/stats");
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    requests: stats.totalReqs,
    attacks: stats.attacks.length,
    errors: stats.errors.length,
  });
});

// Public site settings (no auth needed for client to fetch)
app.get("/api/v1/public/settings", async (req, res) => {
  try {
    const SiteSetting = require("./modules/site-setting/site-setting.model");
    const keys = req.query.keys ? req.query.keys.split(",") : [];
    const filter = keys.length > 0 ? { key: { $in: keys } } : {};
    const settings = await SiteSetting.find(filter).select("key value type").lean();
    const map = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    res.json({ success: true, data: map });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
});

// Routes
app.use("/api/v1", routes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use(errorHandler);

module.exports = app;
