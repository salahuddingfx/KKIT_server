const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Notice = sequelize.define(
  "Notice",
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
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "general",
    },
    priority: {
      type: DataTypes.STRING(50),
      defaultValue: "medium",
    },
    targetAudience: {
      type: DataTypes.STRING(50),
      defaultValue: "all",
    },
    targetCourses: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    classLink: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    classSchedule: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    author: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    readBy: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: "notices",
    timestamps: true,
  }
);

enhanceModel(Notice);

module.exports = Notice;
