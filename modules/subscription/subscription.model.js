const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Subscription = sequelize.define(
  "Subscription",
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nextBillingDate: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      defaultValue: "manual",
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    stripeCustomerId: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "subscriptions",
    timestamps: true,
  }
);

enhanceModel(Subscription);

module.exports = Subscription;
