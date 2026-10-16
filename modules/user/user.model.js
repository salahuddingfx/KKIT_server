const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      url: String,
      publicId: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    designation: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    socialLinks: {
      facebook: String,
      linkedin: String,
      twitter: String,
      github: String,
    },
    enrolledCourses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        enrolledAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
      },
    ],
    completedLessons: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        lesson: { type: mongoose.Schema.Types.Mixed },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    passwordResetToken: String,
    passwordResetExpire: Date,
    refreshToken: String,
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
    loginHistory: [
      {
        date: { type: Date, default: Date.now },
      },
    ],
    fcmTokens: [
      {
        type: String,
      },
    ],
    otpCode: String,
    otpExpire: Date,
    otpPurpose: String,
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
  });
};

module.exports = mongoose.model("User", userSchema);
