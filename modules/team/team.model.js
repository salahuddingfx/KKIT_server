const mongoose = require("mongoose");
const { slugify } = require("../../utils/helpers");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    department: String,
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      url: String,
      publicId: String,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: String,
    socialLinks: {
      facebook: String,
      linkedin: String,
      twitter: String,
      github: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  },
  { timestamps: true }
);

teamSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

module.exports = mongoose.model("Team", teamSchema);
