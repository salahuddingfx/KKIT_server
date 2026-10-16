const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
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
    lesson: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    watchTime: {
      type: Number,
      default: 0,
    },
    lastPosition: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, course: 1, lesson: 1 });
progressSchema.index({ user: 1, course: 1 });

module.exports = mongoose.model("Progress", progressSchema);
