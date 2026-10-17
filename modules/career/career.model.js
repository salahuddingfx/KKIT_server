const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Career = sequelize.define(
  "Career",
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(200),
      unique: true,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "full-time",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    responsibilities: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    salary: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "careers",
    timestamps: true,
  }
);

enhanceModel(Career);

module.exports = Career;
