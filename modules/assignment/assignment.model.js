const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Assignment = sequelize.define(
  "Assignment",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    module: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    instructions: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    maxPoints: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100,
    },
    passingPoints: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    rubricCriteria: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    milestones: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    allowLateSubmission: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    latePenaltyPercent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "published",
    },
  },
  {
    tableName: "assignments",
    timestamps: true,
  }
);

enhanceModel(Assignment);

module.exports = Assignment;
