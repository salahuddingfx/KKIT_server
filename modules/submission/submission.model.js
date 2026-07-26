const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    textContent: {
      type: String,
    },
    links: [
      {
        title: String,
        url: String,
      },
    ],
    files: [
      {
        title: String,
        url: String,
        publicId: String,
        fileType: String,
        fileSize: Number,
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "returned", "resubmitted"],
      default: "submitted",
    },
    grade: {
      points: { type: Number, min: 0 },
      percentage: { type: Number, min: 0, max: 100 },
      letter: { type: String },
      gradedAt: Date,
      gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    feedback: {
      text: String,
      attachments: [
        {
          title: String,
          url: String,
        },
      ],
      givenAt: Date,
      givenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    rubricScores: [
      {
        criterion: String,
        maxPoints: Number,
        awardedPoints: Number,
        comment: String,
      },
    ],
    milestoneProgress: [
      {
        milestoneTitle: String,
        completed: { type: Boolean, default: false },
        completedAt: Date,
        awardedPoints: { type: Number, default: 0 },
      },
    ],
    plagiarismCheck: {
      score: Number,
      checkedAt: Date,
    },
    returnNote: String,
    returnedAt: Date,
    returnedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 });
submissionSchema.index({ student: 1 });
submissionSchema.index({ course: 1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model("Submission", submissionSchema);
