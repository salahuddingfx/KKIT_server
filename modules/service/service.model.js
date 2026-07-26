const mongoose = require("mongoose");
const { slugify } = require("../../utils/helpers");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    icon: String,
    image: {
      url: String,
      publicId: String,
    },
    features: [String],
    technologies: [String],
    pricing: {
      startingAt: Number,
      period: String,
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
    seo: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

serviceSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  next();
});

module.exports = mongoose.model("Service", serviceSchema);
