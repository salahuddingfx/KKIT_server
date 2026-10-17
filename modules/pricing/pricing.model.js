const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");
const { slugify } = require("../../utils/helpers");

const Pricing = sequelize.define(
  "Pricing",
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(191),
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    period: {
      type: DataTypes.STRING(50),
      defaultValue: "month",
    },
    description: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    badge: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
  },
  {
    tableName: "pricings",
    timestamps: true,
    hooks: {
      beforeSave: (pricing) => {
        if (!pricing.slug || pricing.changed("name")) {
          pricing.slug = slugify(pricing.name);
        }
      },
    },
  }
);

enhanceModel(Pricing);

module.exports = Pricing;
