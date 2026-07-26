const mongoose = require("mongoose");
const { slugify } = require("../../utils/helpers");

const pricingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    period: {
      type: String,
      default: "month",
    },
    description: {
      type: String,
      maxlength: 300,
    },
    features: [
      {
        text: { type: String, required: true },
        included: { type: Boolean, default: true },
      },
    ],
    isPopular: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    order: {
      type: Number,
      default: 0,
    },
    badge: String,
  },
  { timestamps: true }
);

pricingSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

module.exports = mongoose.model("Pricing", pricingSchema);
