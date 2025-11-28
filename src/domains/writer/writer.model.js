const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
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

// Instance method to compare password
writerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to hash password
writerSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Pre-save middleware to hash password
writerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    this.password = await this.constructor.hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Writer", writerSchema);
