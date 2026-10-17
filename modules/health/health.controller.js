const sequelize = require("../../config/sequelize");
const env = require("../../config/env");

const getHealth = async (req, res) => {
  let isConnected = true;
  try {
    await sequelize.authenticate();
  } catch {
    isConnected = false;
  }

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
      type: "mysql/mariadb",
      state: isConnected ? "connected" : "disconnected",
      ready: isConnected,
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
