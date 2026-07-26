const mongoose = require("mongoose");
const { slugify } = require("../../utils/helpers");

const learningPathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Learning path title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    image: {
      url: String,
      publicId: String,
    },
    courses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    estimatedDuration: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: [String],
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

learningPathSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  next();
});

learningPathSchema.index({ title: "text", description: "text" });
learningPathSchema.index({ status: 1 });
learningPathSchema.index({ category: 1 });
learningPathSchema.index({ difficulty: 1 });

module.exports = mongoose.model("LearningPath", learningPathSchema);
