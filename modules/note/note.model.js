const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Note = sequelize.define(
  "Note",
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
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lessonId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notes",
    timestamps: true,
  }
);

enhanceModel(Note);

module.exports = Note;
