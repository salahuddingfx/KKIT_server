const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");
const { INVOICE_STATUS } = require("../../utils/constants");

const Invoice = sequelize.define(
  "Invoice",
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
    invoiceNumber: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    payment: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: INVOICE_STATUS ? INVOICE_STATUS.PENDING : "pending",
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    billingDetails: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    items: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    pdfUrl: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    paidAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "invoices",
    timestamps: true,
  }
);

enhanceModel(Invoice);

module.exports = Invoice;
