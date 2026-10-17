const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Submission = sequelize.define(
  "Submission",
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
    assignment: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attemptNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    textContent: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    links: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    files: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isLate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "submitted",
    },
    grade: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    feedback: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  },
  {
    tableName: "submissions",
    timestamps: true,
  }
);

enhanceModel(Submission);

module.exports = Submission;
