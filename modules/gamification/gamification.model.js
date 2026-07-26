const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    badgeId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const gamificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [badgeSchema],
    stats: {
      lessonsCompleted: { type: Number, default: 0 },
      coursesCompleted: { type: Number, default: 0 },
      assignmentsSubmitted: { type: Number, default: 0 },
      projectsSubmitted: { type: Number, default: 0 },
      reviewsWritten: { type: Number, default: 0 },
      discussionsCreated: { type: Number, default: 0 },
      totalWatchTime: { type: Number, default: 0 },
    },
    pointsHistory: [
      {
        amount: Number,
        reason: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

gamificationSchema.index({ points: -1 });

module.exports = mongoose.model("Gamification", gamificationSchema);
