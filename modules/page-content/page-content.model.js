const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const PageContent = sequelize.define(
  "PageContent",
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
    page: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    sections: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    seo: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
  },
  {
    tableName: "page_contents",
    timestamps: true,
  }
);

enhanceModel(PageContent);

module.exports = PageContent;
