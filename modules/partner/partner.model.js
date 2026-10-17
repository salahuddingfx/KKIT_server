const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Partner = sequelize.define(
  "Partner",
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
      type: DataTypes.STRING(191),
      unique: true,
    },
    logo: {
      type: DataTypes.JSON,
      defaultValue: { url: "", publicId: "" },
    },
    icon: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    color: {
      type: DataTypes.STRING(50),
      defaultValue: "#6366f1",
    },
    website: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    description: {
      type: DataTypes.STRING(500),
      defaultValue: "",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "hiring",
    },
  },
  {
    tableName: "partners",
    timestamps: true,
    hooks: {
      beforeSave: (partner) => {
        if (!partner.slug || partner.changed("name")) {
          partner.slug = partner.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }
      },
    },
  }
);

enhanceModel(Partner);

module.exports = Partner;
