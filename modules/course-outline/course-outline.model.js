const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const CourseOutlineRequest = sequelize.define(
  "CourseOutlineRequest",
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
    courseName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    whatsapp: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    sentAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "course_outline_requests",
    timestamps: true,
  }
);

enhanceModel(CourseOutlineRequest);

module.exports = CourseOutlineRequest;
