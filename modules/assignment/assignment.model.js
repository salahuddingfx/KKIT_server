const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    module: {
      type: String,
      trim: true,
    },
    instructions: String,
    attachments: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ["pdf", "link", "file", "image"] },
      },
    ],
    maxPoints: {
      type: Number,
      required: true,
      min: 1,
    },
    passingPoints: {
      type: Number,
      default: 0,
    },
    rubricCriteria: [
      {
        criterion: { type: String, required: true },
        maxPoints: { type: Number, required: true },
        description: String,
      },
    ],
    milestones: [
      {
        title: { type: String, required: true },
        description: String,
        maxPoints: { type: Number, default: 0 },
        order: { type: Number, default: 0 },
      },
    ],
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    allowLateSubmission: {
      type: Boolean,
      default: false,
    },
    latePenaltyPerDay: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    submissionType: {
      type: String,
      enum: ["file", "text", "link", "file_and_text", "any"],
      default: "file_and_text",
    },
    allowedFileTypes: [String],
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024, // 10MB
    },
    maxSubmissions: {
      type: Number,
      default: 1,
    },
    assignedTo: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedAt: { type: Date, default: Date.now },
      },
    ],
    assignedToAll: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    averageGrade: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

assignmentSchema.index({ course: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ dueDate: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);
