const mongoose = require("mongoose");
const { slugify } = require("../../utils/helpers");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    thumbnail: {
      url: String,
      publicId: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected", "archived"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    publishedAt: Date,
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.index({ title: "text", content: "text" });
blogSchema.index({ status: 1 });

module.exports = mongoose.model("Blog", blogSchema);
