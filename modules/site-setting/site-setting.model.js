const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const SiteSetting = sequelize.define(
  "SiteSetting",
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
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "string",
    },
    category: {
      type: DataTypes.STRING(50),
      defaultValue: "general",
    },
    label: {
      type: DataTypes.STRING(200),
      defaultValue: null,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  },
  {
    tableName: "site_settings",
    timestamps: true,
  }
);

enhanceModel(SiteSetting);

module.exports = SiteSetting;
