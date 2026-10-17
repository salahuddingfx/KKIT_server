const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const WebhookDelivery = sequelize.define(
  "WebhookDelivery",
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
    webhook: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    event: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    response: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    success: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    error: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    duration: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: "webhook_deliveries",
    timestamps: true,
  }
);

enhanceModel(WebhookDelivery);

module.exports = WebhookDelivery;
