const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Subscriber = sequelize.define(
  "Subscriber",
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
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    source: {
      type: DataTypes.STRING(50),
      defaultValue: "website",
    },
  },
  {
    tableName: "subscribers",
    timestamps: true,
  }
);

enhanceModel(Subscriber);

module.exports = Subscriber;
