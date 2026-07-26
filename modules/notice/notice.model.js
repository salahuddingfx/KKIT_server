const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Notice content is required"],
    },
    type: {
      type: String,
      enum: ["info", "warning", "urgent", "maintenance", "general"],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    targetAudience: {
      type: String,
      enum: ["all", "students", "instructors", "admins"],
      default: "all",
    },
    targetCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    classLink: {
      type: String,
      trim: true,
    },
    classSchedule: {
      type: Date,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    attachments: [
      {
        url: String,
        publicId: String,
        name: String,
        type: String,
      },
    ],
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

noticeSchema.index({ title: "text", content: "text" });
noticeSchema.index({ isActive: 1, isPinned: -1, createdAt: -1 });
noticeSchema.index({ targetAudience: 1 });

module.exports = mongoose.model("Notice", noticeSchema);
