const mongoose = require("mongoose");
const { INVOICE_STATUS } = require("../../utils/constants");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    amount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(INVOICE_STATUS),
      default: INVOICE_STATUS.PENDING,
    },
    paymentMethod: String,
    billingDetails: {
      name: String,
      email: String,
      address: String,
      phone: String,
    },
    items: [
      {
        description: String,
        amount: Number,
      },
    ],
    pdfUrl: String,
    paidAt: Date,
  },
  { timestamps: true }
);

invoiceSchema.index({ user: 1 });

module.exports = mongoose.model("Invoice", invoiceSchema);
