const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Faq = sequelize.define(
  "Faq",
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
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      defaultValue: "general",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "faqs",
    timestamps: true,
  }
);

enhanceModel(Faq);

module.exports = Faq;
