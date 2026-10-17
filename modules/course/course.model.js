const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");
const { slugify } = require("../../utils/helpers");

const Course = sequelize.define(
  "Course",
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
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    thumbnail: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    trailer: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    instructor: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    mentors: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    trainers: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    category: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    level: {
      type: DataTypes.STRING(50),
      defaultValue: "beginner",
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    discountPrice: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
    },
    modules: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    totalDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalLessons: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    enrolledStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.JSON,
      defaultValue: { average: 0, count: 0 },
    },
    prerequisites: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    learningOutcomes: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    techStack: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    projects: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    highlights: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    language: {
      type: DataTypes.STRING(50),
      defaultValue: "Bangla",
    },
    certificateIncluded: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "draft",
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    seo: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
    hooks: {
      beforeSave: (course) => {
        if (!course.slug || course.changed("title")) {
          course.slug = slugify(course.title);
        }
        if (Array.isArray(course.modules)) {
          let totalDuration = 0;
          let totalLessons = 0;
          course.modules.forEach((mod) => {
            if (Array.isArray(mod.lessons)) {
              mod.lessons.forEach((lesson) => {
                totalDuration += Number(lesson.duration) || 0;
                totalLessons += 1;
              });
            }
          });
          course.totalDuration = totalDuration;
          course.totalLessons = totalLessons;
        }
      },
    },
  }
);

enhanceModel(Course);

module.exports = Course;
