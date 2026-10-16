const mongoose = require("mongoose");
const crypto = require("crypto");

const webhookSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    events: [
      {
        type: String,
        enum: [
          "user.registered",
          "payment.completed",
          "payment.failed",
          "course.enrolled",
          "course.completed",
          "certificate.generated",
          "subscription.created",
          "subscription.cancelled",
        ],
      },
    ],
    secret: {
      type: String,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastTriggered: Date,
    failureCount: {
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

module.exports = mongoose.model("Webhook", webhookSchema);
