const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Writer",
      required: [true, "Author is required"],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog reference is required"],
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // For nested comments/replies
    },
    isApproved: {
      type: Boolean,
      default: true, // Comments are auto-approved for now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Writer",
    }],
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for like count
commentSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual for reply count
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});

// Index for better query performance
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Pre-save middleware to update reply count for parent comment
commentSchema.pre("save", async function (next) {
  if (this.isNew && this.parentComment) {
    await mongoose.model("Comment").findByIdAndUpdate(
      this.parentComment,
      { $inc: { replyCount: 1 } }
    );
  }
  next();
});

module.exports = mongoose.model("Comment", commentSchema);