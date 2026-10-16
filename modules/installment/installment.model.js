const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema(
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
    totalAmount: {
      type: Number,
      required: true,
    },
    numberOfInstallments: {
      type: Number,
      required: true,
    },
    installmentAmount: {
      type: Number,
      required: true,
    },
    installments: [
      {
        number: Number,
        amount: Number,
        dueDate: Date,
        status: {
          type: String,
          enum: ["pending", "paid", "overdue"],
          default: "pending",
        },
        paidAt: Date,
        transactionId: String,
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "defaulted"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

installmentSchema.index({ user: 1 });
installmentSchema.index({ status: 1 });

module.exports = mongoose.model("Installment", installmentSchema);
