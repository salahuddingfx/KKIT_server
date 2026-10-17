const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const ContactSubmission = sequelize.define(
  "ContactSubmission",
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
      defaultValue: null,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "new",
    },
    repliedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    repliedBy: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "contact_submissions",
    timestamps: true,
  }
);

enhanceModel(ContactSubmission);

module.exports = ContactSubmission;
