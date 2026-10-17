const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Enrollment = sequelize.define(
  "Enrollment",
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
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    payment: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    progress: {
      type: DataTypes.JSON,
      defaultValue: { completedLessons: 0, totalLessons: 0, percentage: 0 },
    },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    certificate: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "enrollments",
    timestamps: true,
  }
);

enhanceModel(Enrollment);

module.exports = Enrollment;
