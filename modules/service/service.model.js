const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");
const { slugify } = require("../../utils/helpers");

const Service = sequelize.define(
  "Service",
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
      type: DataTypes.STRING(191),
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    icon: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    image: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    technologies: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    pricing: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    seo: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
  },
  {
    tableName: "services",
    timestamps: true,
    hooks: {
      beforeSave: (service) => {
        if (!service.slug || service.changed("title")) {
          service.slug = slugify(service.title);
        }
      },
    },
  }
);

enhanceModel(Service);

module.exports = Service;
