const mongoose = require("mongoose");
const { slugify } = require("../../utils/helpers");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  duration: Number,
  order: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  notes: String,
  codeExamples: [
    {
      title: String,
      language: { type: String, default: "javascript" },
      code: String,
      description: String,
    },
  ],
  attachments: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ["pdf", "link", "file", "zip", "image"] },
      size: Number,
    },
  ],
  resources: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ["pdf", "link", "file"] },
    },
  ],
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: { type: Number, default: 0 },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    thumbnail: {
      url: String,
      publicId: String,
    },
    trailer: {
      url: String,
      publicId: String,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentors: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedAt: { type: Date, default: Date.now },
      },
    ],
    trainers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedAt: { type: Date, default: Date.now },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [String],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    modules: [moduleSchema],
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    prerequisites: [String],
    learningOutcomes: [String],
    techStack: [
      {
        name: { type: String, required: true },
        icon: String,
        color: String,
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: String,
        image: String,
        techUsed: [String],
        link: String,
      },
    ],
    highlights: [String],
    language: {
      type: String,
      default: "Bangla",
    },
    certificateIncluded: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  // Recalculate totals
  let totalDuration = 0;
  let totalLessons = 0;
  this.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      totalDuration += lesson.duration || 0;
      totalLessons += 1;
    });
  });
  this.totalDuration = totalDuration;
  this.totalLessons = totalLessons;
  next();
});

courseSchema.index({ title: "text", description: "text" }, { language_override: "dummy_language_override" });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });

module.exports = mongoose.model("Course", courseSchema);
