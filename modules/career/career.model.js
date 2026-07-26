const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [String],
    responsibilities: [String],
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "BDT" },
      period: { type: String, default: "month" },
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

careerSchema.index({ title: "text", department: "text" });

module.exports = mongoose.model("Career", careerSchema);
