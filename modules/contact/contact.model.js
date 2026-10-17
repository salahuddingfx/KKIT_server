const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Contact = sequelize.define(
  "Contact",
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
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "unread",
    },
    reply: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    source: {
      type: DataTypes.STRING(50),
      defaultValue: "website",
    },
  },
  {
    tableName: "contacts",
    timestamps: true,
  }
);

enhanceModel(Contact);

module.exports = Contact;
