const mongoose = require("mongoose");
const { generateCertificateNumber } = require("../../utils/helpers");

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
    },
    studentName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    completionDate: {
      type: Date,
      default: Date.now,
    },
    pdfUrl: String,
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
  },
  { timestamps: true }
);

certificateSchema.pre("save", async function (next) {
  if (!this.certificateNumber) {
    const count = await mongoose.model("Certificate").countDocuments();
    this.certificateNumber = generateCertificateNumber(count + 1);
  }
  next();
});

certificateSchema.index({ user: 1 });
certificateSchema.index({ course: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);
