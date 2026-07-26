const mongoose = require("mongoose");

const sectionItemSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    icon: String,
    image: {
      url: String,
      publicId: String,
    },
    url: String,
    value: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    title: String,
    subtitle: String,
    content: String,
    image: {
      url: String,
      publicId: String,
    },
    videoUrl: String,
    items: [sectionItemSchema],
    stats: [
      {
        label: String,
        value: String,
        icon: String,
      },
    ],
    meta: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const pageContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: String,
    description: String,
    sections: [sectionSchema],
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PageContent", pageContentSchema);
