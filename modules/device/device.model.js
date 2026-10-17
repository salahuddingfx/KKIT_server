const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const DeviceSession = sequelize.define(
  "DeviceSession",
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
    user: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    fingerprint: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    ip: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    deviceInfo: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastActivity: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "device_sessions",
    timestamps: true,
  }
);

enhanceModel(DeviceSession);

module.exports = DeviceSession;
