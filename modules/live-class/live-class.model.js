const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Live class title is required"],
      trim: true,
      maxlength: 200,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    scheduledAt: {
      type: Date,
      required: [true, "Scheduled time is required"],
    },
    duration: {
      type: Number,
      default: 60,
      min: 1,
    },
    meetingUrl: {
      type: String,
      default: "",
    },
    meetingId: {
      type: String,
      default: "",
    },
    meetingPassword: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxAttendees: {
      type: Number,
      default: 100,
    },
    recording: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

liveClassSchema.index({ scheduledAt: 1 });
liveClassSchema.index({ course: 1, status: 1 });
liveClassSchema.index({ instructor: 1 });
liveClassSchema.index({ status: 1, scheduledAt: 1 });

const LiveClass = mongoose.model("LiveClass", liveClassSchema);
module.exports = LiveClass;
