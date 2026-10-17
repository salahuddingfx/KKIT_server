const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");
const { slugify } = require("../../utils/helpers");

const Blog = sequelize.define(
  "Blog",
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
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    thumbnail: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    author: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    seo: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    publishedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "blogs",
    timestamps: true,
    hooks: {
      beforeSave: (blog) => {
        if (!blog.slug || blog.changed("title")) {
          blog.slug = slugify(blog.title);
        }
      },
    },
  }
);

enhanceModel(Blog);

module.exports = Blog;
