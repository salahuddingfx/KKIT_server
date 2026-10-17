const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const HomeStat = sequelize.define(
  "HomeStat",
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
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    suffix: {
      type: DataTypes.STRING(50),
      defaultValue: "",
    },
    icon: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    color: {
      type: DataTypes.STRING(50),
      defaultValue: "#6366f1",
    },
    description: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    section: {
      type: DataTypes.STRING(50),
      defaultValue: "stats",
    },
  },
  {
    tableName: "home_stats",
    timestamps: true,
  }
);

enhanceModel(HomeStat);

module.exports = HomeStat;
