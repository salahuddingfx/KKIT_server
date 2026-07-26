const mongoose = require("mongoose");
const env = require("../../config/env");

const getHealth = async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    uptimeSeconds: Math.floor(uptime),
    environment: env.NODE_ENV || "development",
    database: {
      state: states[dbState] || "unknown",
      ready: dbState === 1,
    },
    memory: {
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
    },
    version: "1.0.0",
  });
};

module.exports = { getHealth };
