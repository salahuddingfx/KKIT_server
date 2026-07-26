const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Partner name is required"],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    icon: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    website: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ["hiring", "technology", "certification", "placement"],
      default: "hiring",
    },
  },
  { timestamps: true }
);

partnerSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

partnerSchema.index({ name: 1 });
partnerSchema.index({ isActive: 1, order: 1 });

const Partner = mongoose.model("Partner", partnerSchema);
module.exports = Partner;
