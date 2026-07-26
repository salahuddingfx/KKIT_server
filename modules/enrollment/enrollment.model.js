const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled", "expired"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    progress: {
      completedLessons: { type: Number, default: 0 },
      totalLessons: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },
    completedAt: Date,
    expiresAt: Date,
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ status: 1 });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
