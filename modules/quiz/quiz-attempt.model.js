const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const QuizAttempt = sequelize.define(
  "QuizAttempt",
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
    quiz: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answers: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalPoints: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    passed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    attemptedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "quiz_attempts",
    timestamps: true,
  }
);

enhanceModel(QuizAttempt);

module.exports = QuizAttempt;
