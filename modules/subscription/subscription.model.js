const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pricing",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "paused", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    nextBillingDate: Date,
    paymentMethod: {
      type: String,
      enum: ["stripe", "sslcommerz", "bkash", "manual"],
      default: "manual",
    },
    stripeSubscriptionId: String,
    stripeCustomerId: String,
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    cancelledAt: Date,
    pauseStartDate: Date,
    pauseEndDate: Date,
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

module.exports = mongoose.model("Subscription", subscriptionSchema);
