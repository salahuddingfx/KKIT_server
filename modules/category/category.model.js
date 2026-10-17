const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Category = sequelize.define(
  "Category",
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
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(191),
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    icon: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    color: {
      type: DataTypes.STRING(50),
      defaultValue: "#6366f1",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    courseCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    hooks: {
      beforeSave: (category) => {
        if (!category.slug || category.changed("name")) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }
      },
    },
  }
);

enhanceModel(Category);

module.exports = Category;
