const mongoose = require("mongoose");

const writerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Writer name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    socialLinks: {
      website: String,
      twitter: String,
      linkedin: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for writer's blog count
writerSchema.virtual("blogCount", {
  ref: "Blog",
  localField: "_id",
  foreignField: "writer",
  count: true,
});

// Instance method to get writer's published blogs
writerSchema.methods.getPublishedBlogs = function () {
  return mongoose.model("Blog").find({ writer: this._id, isPublished: true });
};

// Static method to find active writers
writerSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

module.exports = mongoose.model("Writer", writerSchema);
