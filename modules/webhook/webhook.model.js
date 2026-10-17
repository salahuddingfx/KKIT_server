const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Webhook = sequelize.define(
  "Webhook",
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
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    events: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    secret: {
      type: DataTypes.STRING(100),
      defaultValue: () => crypto.randomBytes(32).toString("hex"),
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastTriggered: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    failureCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "webhooks",
    timestamps: true,
  }
);

enhanceModel(Webhook);

module.exports = Webhook;
