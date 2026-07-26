const mongoose = require("mongoose");

const courseOutlineRequestSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    sentAt: Date,
  },
  { timestamps: true }
);

courseOutlineRequestSchema.index({ course: 1 });
courseOutlineRequestSchema.index({ email: 1 });
courseOutlineRequestSchema.index({ createdAt: 1 });

module.exports = mongoose.model("CourseOutlineRequest", courseOutlineRequestSchema);
