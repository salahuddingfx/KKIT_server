const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const ChatMessage = sequelize.define(
  "ChatMessage",
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
    room: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "text",
    },
    readBy: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: "chat_messages",
    timestamps: true,
  }
);

enhanceModel(ChatMessage);

module.exports = ChatMessage;
