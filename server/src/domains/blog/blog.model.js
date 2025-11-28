const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot be more than 300 characters"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Writer",
      required: [true, "Writer is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted published date
blogSchema.virtual("formattedPublishedDate").get(function () {
  if (!this.publishedAt) return null;
  return this.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Auto-generate excerpt from content if not provided
blogSchema.pre("save", function (next) {
  if (this.content && !this.excerpt) {
    this.excerpt = this.content.substring(0, 150) + "...";
  }

  // Set publishedAt when isPublished becomes true
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Index for better query performance
blogSchema.index({ writer: 1, createdAt: -1 });
blogSchema.index({ isPublished: 1 });

module.exports = mongoose.model("Blog", blogSchema);
