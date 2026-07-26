const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    shortDescription: {
      type: String,
      default: "",
      maxlength: 300,
    },
    badge: {
      type: String,
      default: "Limited Time",
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "bogo"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    bannerImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      default: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    termsAndConditions: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

offerSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

offerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
offerSchema.index({ isFeatured: 1 });

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
