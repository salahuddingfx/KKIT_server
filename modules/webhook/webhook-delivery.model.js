const mongoose = require("mongoose");

const webhookDeliverySchema = new mongoose.Schema(
  {
    webhook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webhook",
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    statusCode: Number,
    response: String,
    success: {
      type: Boolean,
      default: false,
    },
    error: String,
    duration: Number,
  },
  { timestamps: true }
);

webhookDeliverySchema.index({ webhook: 1, createdAt: -1 });

module.exports = mongoose.model("WebhookDelivery", webhookDeliverySchema);
