const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");
const { PAYMENT_STATUS } = require("../../utils/constants");

const Payment = sequelize.define(
  "Payment",
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
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "BDT",
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: PAYMENT_STATUS ? PAYMENT_STATUS.PENDING : "pending",
    },
    method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    paymentIntentId: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    billingDetails: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    paymentProof: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    meta: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    invoice: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
  }
);

enhanceModel(Payment);

module.exports = Payment;
