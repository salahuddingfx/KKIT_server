const mongoose = require("mongoose");

const homeStatSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Stat label is required"],
      trim: true,
      maxlength: 100,
    },
    value: {
      type: String,
      required: [true, "Stat value is required"],
      trim: true,
    },
    suffix: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    section: {
      type: String,
      enum: ["hero", "stats", "features", "footer"],
      default: "stats",
    },
  },
  { timestamps: true }
);

homeStatSchema.index({ section: 1, order: 1 });

const HomeStat = mongoose.model("HomeStat", homeStatSchema);
module.exports = HomeStat;
