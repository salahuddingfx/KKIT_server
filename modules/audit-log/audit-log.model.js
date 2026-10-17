const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      defaultValue: "visitor",
    },
    user: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    userName: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    userEmail: {
      type: DataTypes.STRING(191),
      defaultValue: null,
    },
    userPhone: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    ip: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    country: {
      type: DataTypes.STRING(100),
      defaultValue: "Bangladesh",
    },
    countryCode: {
      type: DataTypes.STRING(10),
      defaultValue: "BD",
    },
    city: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    userAgent: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    browser: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    os: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    device: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    path: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    method: {
      type: DataTypes.STRING(20),
      defaultValue: null,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    details: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "info",
    },
  },
  {
    tableName: "audit_logs",
    timestamps: true,
  }
);

enhanceModel(AuditLog);

module.exports = AuditLog;
