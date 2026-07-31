const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["visitor", "auth", "payment", "admin", "lead", "system"],
      default: "visitor",
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: String,
    userEmail: String,
    userPhone: String,
    ip: {
      type: String,
      index: true,
    },
    country: {
      type: String,
      default: "Bangladesh",
      index: true,
    },
    countryCode: {
      type: String,
      default: "BD",
    },
    city: String,
    userAgent: String,
    browser: String,
    os: String,
    device: String,
    path: String,
    method: String,
    statusCode: Number,
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["success", "warning", "error", "info"],
      default: "info",
      index: true,
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ country: 1, action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
