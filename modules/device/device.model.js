const mongoose = require("mongoose");

const deviceSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    userAgent: String,
    ip: String,
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

deviceSessionSchema.index({ user: 1, isActive: 1 });
deviceSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("DeviceSession", deviceSessionSchema);
