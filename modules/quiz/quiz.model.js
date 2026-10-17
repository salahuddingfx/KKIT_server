const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Quiz = sequelize.define(
  "Quiz",
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
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lesson: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    questions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    passingScore: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "draft",
    },
  },
  {
    tableName: "quizzes",
    timestamps: true,
  }
);

enhanceModel(Quiz);

module.exports = Quiz;
