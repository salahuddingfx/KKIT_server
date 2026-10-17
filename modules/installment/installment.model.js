const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Installment = sequelize.define(
  "Installment",
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
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    numberOfInstallments: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    installmentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    installments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "installments",
    timestamps: true,
  }
);

enhanceModel(Installment);

module.exports = Installment;
