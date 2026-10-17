const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Gamification = sequelize.define(
  "Gamification",
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
      unique: true,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    badges: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    stats: {
      type: DataTypes.JSON,
      defaultValue: {
        lessonsCompleted: 0,
        coursesCompleted: 0,
        assignmentsSubmitted: 0,
        projectsSubmitted: 0,
        reviewsWritten: 0,
        discussionsCreated: 0,
        totalWatchTime: 0,
      },
    },
    pointsHistory: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: "gamifications",
    timestamps: true,
  }
);

enhanceModel(Gamification);

module.exports = Gamification;
