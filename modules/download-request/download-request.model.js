const mongoose = require("mongoose");

const downloadRequestSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    moduleName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    sentAt: Date,
  },
  { timestamps: true }
);

downloadRequestSchema.index({ course: 1 });
downloadRequestSchema.index({ email: 1 });
downloadRequestSchema.index({ createdAt: 1 });

module.exports = mongoose.model("DownloadRequest", downloadRequestSchema);
