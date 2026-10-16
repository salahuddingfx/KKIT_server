const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.Mixed,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    questions: [
      {
        question: { type: String, required: true },
        type: {
          type: String,
          enum: ["mcq", "true-false", "short-answer"],
          default: "mcq",
        },
        options: [String],
        correctAnswer: { type: String, required: true },
        points: { type: Number, default: 1 },
        explanation: String,
      },
    ],
    timeLimit: {
      type: Number,
      default: 0,
    },
    passingScore: {
      type: Number,
      default: 60,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

quizSchema.index({ course: 1 });

module.exports = mongoose.model("Quiz", quizSchema);
