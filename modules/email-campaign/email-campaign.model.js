const mongoose = require("mongoose");

const emailCampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
      maxlength: 200,
    },
    subject: {
      type: String,
      required: [true, "Subject line is required"],
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: [true, "Email content is required"],
    },
    template: {
      type: String,
      enum: ["promotional", "welcome", "announcement", "custom"],
      default: "custom",
    },
    targetAudience: {
      type: String,
      enum: ["all", "students", "instructors", "leads", "custom"],
      default: "all",
    },
    targetFilters: {
      role: String,
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      enrolledAfter: Date,
      enrolledBefore: Date,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "failed"],
      default: "draft",
    },
    scheduledAt: Date,
    sentAt: Date,
    totalSent: {
      type: Number,
      default: 0,
    },
    totalOpened: {
      type: Number,
      default: 0,
    },
    totalClicked: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

emailCampaignSchema.index({ status: 1 });
emailCampaignSchema.index({ createdBy: 1 });
emailCampaignSchema.index({ scheduledAt: 1, status: 1 });

module.exports = mongoose.model("EmailCampaign", emailCampaignSchema);
