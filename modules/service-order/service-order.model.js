const mongoose = require("mongoose");

const serviceOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    serviceName: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: ["basic", "pro", "enterprise"],
      default: "basic",
    },
    customAddons: [
      {
        name: String,
        price: Number,
      },
    ],
    brief: {
      type: String,
      required: true,
    },
    attachments: [
      {
        url: String,
        name: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "bank_transfer", "manual", "card"],
      default: "bkash",
    },
    transactionId: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "deposit_paid", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    projectStatus: {
      type: String,
      enum: ["pending_review", "in_progress", "revision", "delivered", "completed", "cancelled"],
      default: "pending_review",
    },
    deliverables: [
      {
        title: String,
        fileUrl: String,
        notes: String,
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deliveryDeadline: Date,
    adminNotes: String,
  },
  { timestamps: true }
);

serviceOrderSchema.index({ user: 1 });
serviceOrderSchema.index({ paymentStatus: 1 });
serviceOrderSchema.index({ projectStatus: 1 });

module.exports = mongoose.model("ServiceOrder", serviceOrderSchema);
