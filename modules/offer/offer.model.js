const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Offer = sequelize.define(
  "Offer",
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(191),
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      defaultValue: "",
    },
    badge: {
      type: DataTypes.STRING(100),
      defaultValue: "Limited Time",
    },
    discountType: {
      type: DataTypes.STRING(50),
      defaultValue: "percentage",
    },
    discountValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    couponCode: {
      type: DataTypes.STRING(100),
      defaultValue: "",
    },
    courses: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    bannerImage: {
      type: DataTypes.JSON,
      defaultValue: { url: "", publicId: "" },
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    termsAndConditions: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    tableName: "offers",
    timestamps: true,
    hooks: {
      beforeSave: (offer) => {
        if (!offer.slug || offer.changed("title")) {
          offer.slug = offer.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }
      },
    },
  }
);

enhanceModel(Offer);

module.exports = Offer;
