const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Project = sequelize.define(
  "Project",
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    courseName: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    deadline: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    allowLateSubmission: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    latePenaltyPerDay: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "not_submitted",
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    feedback: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    grade: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    repoUrl: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    liveUrl: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    milestones: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: "projects",
    timestamps: true,
  }
);

enhanceModel(Project);

module.exports = Project;
