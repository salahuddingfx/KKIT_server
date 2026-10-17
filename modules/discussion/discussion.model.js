const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Discussion = sequelize.define(
  "Discussion",
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lessonId: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "discussion",
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    replies: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    likes: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "discussions",
    timestamps: true,
  }
);

enhanceModel(Discussion);

module.exports = Discussion;
