const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Testimonial = sequelize.define(
  "Testimonial",
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
    designation: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    company: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    avatar: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    user: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    course: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "approved",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "testimonials",
    timestamps: true,
  }
);

enhanceModel(Testimonial);

module.exports = Testimonial;
