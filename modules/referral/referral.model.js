const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Referral = sequelize.define(
  "Referral",
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
    referrer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referredUser: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    referralCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    purchaseAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    commission: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    commissionRate: {
      type: DataTypes.FLOAT,
      defaultValue: 10,
    },
    rewardedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "referrals",
    timestamps: true,
  }
);

enhanceModel(Referral);

module.exports = Referral;
