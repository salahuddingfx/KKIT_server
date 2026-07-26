const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  maxPoints: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
});

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    courseName: String,
    deadline: Date,
    allowLateSubmission: { type: Boolean, default: false },
    latePenaltyPerDay: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["not_submitted", "in_progress", "pending_review", "approved", "revision_requested"],
      default: "not_submitted",
    },
    submittedAt: Date,
    reviewedAt: Date,
    feedback: String,
    grade: String,
    repoUrl: String,
    liveUrl: String,
    milestones: [milestoneSchema],
  },
  { timestamps: true }
);

projectSchema.index({ user: 1 });

module.exports = mongoose.model("Project", projectSchema);
