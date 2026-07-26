const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    category: {
      type: String,
      default: "general",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

faqSchema.index({ category: 1 });
faqSchema.index({ status: 1 });

module.exports = mongoose.model("Faq", faqSchema);
