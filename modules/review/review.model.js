const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Review = sequelize.define(
  "Review",
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
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    title: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    comment: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    helpful: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reportCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
  }
);

enhanceModel(Review);

module.exports = Review;
