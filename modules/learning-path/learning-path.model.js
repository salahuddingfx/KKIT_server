const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const LearningPath = sequelize.define(
  "LearningPath",
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
    slug: {
      type: DataTypes.STRING(200),
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    shortDescription: {
      type: DataTypes.STRING(300),
      defaultValue: null,
    },
    image: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    courses: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    difficulty: {
      type: DataTypes.STRING(50),
      defaultValue: "beginner",
    },
    estimatedDuration: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    category: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    enrolledStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "learning_paths",
    timestamps: true,
  }
);

enhanceModel(LearningPath);

module.exports = LearningPath;
