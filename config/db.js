const sequelize = require("./sequelize");
const env = require("./env");

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("  MySQL / MariaDB connected successfully!");
    
    // Auto-sync MySQL models
    await sequelize.sync({ alter: false });

    return sequelize.config.host || "localhost";
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
