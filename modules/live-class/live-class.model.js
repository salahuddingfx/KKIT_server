const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const LiveClass = sequelize.define(
  "LiveClass",
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
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    instructor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
    },
    meetingUrl: {
      type: DataTypes.STRING(500),
      defaultValue: "",
    },
    meetingId: {
      type: DataTypes.STRING(100),
      defaultValue: "",
    },
    meetingPassword: {
      type: DataTypes.STRING(100),
      defaultValue: "",
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "scheduled",
    },
    attendees: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    maxAttendees: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
  },
  {
    tableName: "live_classes",
    timestamps: true,
  }
);

enhanceModel(LiveClass);

module.exports = LiveClass;
