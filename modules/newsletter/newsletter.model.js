const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Newsletter = sequelize.define(
  "Newsletter",
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
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    user: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    subscribedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    unsubscribedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    source: {
      type: DataTypes.STRING(50),
      defaultValue: "website",
    },
  },
  {
    tableName: "newsletters",
    timestamps: true,
  }
);

enhanceModel(Newsletter);

module.exports = Newsletter;
