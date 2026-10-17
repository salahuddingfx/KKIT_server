const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Progress = sequelize.define(
  "Progress",
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
    lesson: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    watchTime: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    lastPosition: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "progresses",
    timestamps: true,
  }
);

enhanceModel(Progress);

module.exports = Progress;
