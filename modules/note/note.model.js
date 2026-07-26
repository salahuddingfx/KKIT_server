const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: {
      type: String,
      required: [true, "Lesson ID is required"],
    },
    timestamp: {
      type: Number,
      default: null,
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      maxlength: 2000,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

noteSchema.index({ user: 1, course: 1, lessonId: 1 });
noteSchema.index({ user: 1, course: 1, isPinned: -1, createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
