const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    projectType: {
      type: String,
      enum: ["client", "student", "internal"],
      default: "client",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    client: String,
    duration: String,
    technologies: [String],
    liveUrl: String,
    repoUrl: String,
    image: {
      url: String,
      publicId: String,
    },
    gallery: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],
    // Results / metrics for client projects
    metrics: {
      label: String,   // e.g. "Revenue Increase", "Users Gained"
      value: String,   // e.g. "250%", "10K+"
    },
    // Client testimonial
    testimonial: {
      quote: String,
      author: String,
      designation: String,
      company: String,
      avatar: { url: String, publicId: String },
    },
    // For student projects — link to the actual student project
    studentProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    studentName: String,
    courseName: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

portfolioSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Portfolio", portfolioSchema);
