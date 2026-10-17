const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Notification = sequelize.define(
  "Notification",
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
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "info",
    },
    data: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

enhanceModel(Notification);

module.exports = Notification;
