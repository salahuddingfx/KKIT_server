const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Role = sequelize.define(
  "Role",
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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    allowedPages: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isSystem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
  }
);

enhanceModel(Role);

module.exports = Role;
