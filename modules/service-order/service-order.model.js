const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const ServiceOrder = sequelize.define(
  "ServiceOrder",
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
    orderNumber: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    serviceName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    tier: {
      type: DataTypes.STRING(50),
      defaultValue: "basic",
    },
    customAddons: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    brief: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    depositAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      defaultValue: "bkash",
    },
    transactionId: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    paymentStatus: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    orderStatus: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
  },
  {
    tableName: "service_orders",
    timestamps: true,
  }
);

enhanceModel(ServiceOrder);

module.exports = ServiceOrder;
