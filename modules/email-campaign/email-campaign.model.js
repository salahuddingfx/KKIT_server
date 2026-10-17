const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const EmailCampaign = sequelize.define(
  "EmailCampaign",
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
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    template: {
      type: DataTypes.STRING(50),
      defaultValue: "custom",
    },
    targetAudience: {
      type: DataTypes.STRING(50),
      defaultValue: "all",
    },
    targetFilters: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "draft",
    },
    scheduledAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    sentAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    totalSent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalOpened: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalClicked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "email_campaigns",
    timestamps: true,
  }
);

enhanceModel(EmailCampaign);

module.exports = EmailCampaign;
