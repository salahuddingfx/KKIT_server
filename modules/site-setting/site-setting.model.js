const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ["string", "boolean", "number", "json", "image"],
      default: "string",
    },
    category: {
      type: String,
      enum: ["general", "branding", "contact", "social", "seo", "footer", "navbar"],
      default: "general",
    },
    label: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
