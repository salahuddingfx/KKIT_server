const mongoose = require("mongoose");
const { PAYMENT_STATUS } = require("../../utils/constants");

const paymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "BDT",
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    method: {
      type: String,
      enum: ["bkash", "nagad", "bank_transfer", "manual"],
      required: true,
    },
    transactionId: String,
    paymentIntentId: String,
    billingDetails: {
      name: String,
      email: String,
      address: String,
      phone: String,
      city: String,
      country: String,
    },
    // For bKash / Nagad / Bank Transfer — user provides payment proof
    paymentProof: {
      transactionId: String,
      senderNumber: String,
      screenshot: {
        url: String,
        publicId: String,
      },
      bankName: String,
      accountNumber: String,
      branchName: String,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
    refundedAt: Date,
    refundAmount: Number,
    paidAt: Date,
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
