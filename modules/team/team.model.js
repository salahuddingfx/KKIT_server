const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");
const { slugify } = require("../../utils/helpers");

const Team = sequelize.define(
  "Team",
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
    designation: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    bio: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    avatar: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING(191),
      defaultValue: null,
    },
    phone: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    socialLinks: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    experience: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    projects: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    highlights: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isDeveloper: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "teams",
    timestamps: true,
    hooks: {
      beforeSave: (team) => {
        if (!team.slug || team.changed("name")) {
          team.slug = slugify(team.name);
        }
      },
    },
  }
);

enhanceModel(Team);

module.exports = Team;
