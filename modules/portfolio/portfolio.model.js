const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Portfolio = sequelize.define(
  "Portfolio",
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
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING(300),
      defaultValue: null,
    },
    projectType: {
      type: DataTypes.STRING(50),
      defaultValue: "client",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    client: {
      type: DataTypes.STRING(150),
      defaultValue: null,
    },
    duration: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    technologies: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    liveUrl: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    repoUrl: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    image: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    gallery: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    metrics: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    testimonial: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "portfolios",
    timestamps: true,
  }
);

enhanceModel(Portfolio);

module.exports = Portfolio;
