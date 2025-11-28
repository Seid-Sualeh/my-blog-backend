const Comment = require("./comment.model");
const Writer = require("../writer/writer.model");

class CommentService {
  // Create a new comment
  async createComment(commentData) {
    try {
      const comment = new Comment(commentData);
      const savedComment = await comment.save();
      
      // Populate author information
      return await Comment.findById(savedComment._id)
        .populate("author", "name email profileImage")
        .populate("blog", "title");
    } catch (error) {
      throw new Error(`Error creating comment: ${error.message}`);
    }
  }

  // Get all comments for a blog
  async getCommentsByBlog(blogId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = { 
        blog: blogId, 
        parentComment: null, // Only top-level comments
        isApproved: true 
      };

      const comments = await Comment.find(query)
        .populate("author", "name email profileImage")
        .populate({
          path: "replies",
          populate: {
            path: "author",
            select: "name email profileImage"
          },
          options: { sort: { createdAt: 1 } } // Sort replies chronologically
        })
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Comment.countDocuments(query);

      return {
        comments,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
    }
  }

  // Get single comment by ID
  async getCommentById(id) {
    try {
      const comment = await Comment.findById(id)
        .populate("author", "name email profileImage")
        .populate("blog", "title")
        .populate({
          path: "replies",
          populate: {
            path: "author",
            select: "name email profileImage"
          }
        });

      if (!comment) {
        throw new Error("Comment not found");
      }

      return comment;
    } catch (error) {
      throw new Error(`Error fetching comment: ${error.message}`);
    }
  }

  // Update comment
  async updateComment(id, updateData, authorId) {
    try {
      const comment = await Comment.findOne({ _id: id, author: authorId });

      if (!comment) {
        throw new Error("Comment not found or you don't have permission to edit it");
      }

      // Update allowed fields
      if (updateData.content) {
        comment.content = updateData.content;
      }

      const updatedComment = await comment.save();
      return await Comment.findById(updatedComment._id)
        .populate("author", "name email profileImage")
        .populate("blog", "title");
    } catch (error) {
      throw new Error(`Error updating comment: ${error.message}`);
    }
  }

  // Delete comment
  async deleteComment(id, authorId) {
    try {
      const comment = await Comment.findOne({ _id: id, author: authorId });

      if (!comment) {
        throw new Error("Comment not found or you don't have permission to delete it");
      }

      // Delete all replies first
      await Comment.deleteMany({ parentComment: id });

      // Delete the comment
      await Comment.findByIdAndDelete(id);

      // Update parent comment's reply count if it has one
      if (comment.parentComment) {
        await Comment.findByIdAndUpdate(
          comment.parentComment,
          { $inc: { replyCount: -1 } }
        );
      }

      return { message: "Comment and its replies deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting comment: ${error.message}`);
    }
  }

  // Like/unlike comment
  async toggleLike(commentId, writerId) {
    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        throw new Error("Comment not found");
      }

      const hasLiked = comment.likes.includes(writerId);

      if (hasLiked) {
        // Unlike
        await Comment.findByIdAndUpdate(commentId, {
          $pull: { likes: writerId }
        });
        return { liked: false, message: "Comment unliked" };
      } else {
        // Like
        await Comment.findByIdAndUpdate(commentId, {
          $addToSet: { likes: writerId }
        });
        return { liked: true, message: "Comment liked" };
      }
    } catch (error) {
      throw new Error(`Error toggling like: ${error.message}`);
    }
  }

  // Get comments by author
  async getCommentsByAuthor(authorId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = { author: authorId };

      const comments = await Comment.find(query)
        .populate("blog", "title")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Comment.countDocuments(query);

      return {
        comments,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching author's comments: ${error.message}`);
    }
  }

  // Approve/reject comment (for moderation)
  async moderateComment(id, isApproved) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        id,
        { isApproved },
        { new: true }
      ).populate("author", "name email")
       .populate("blog", "title");

      if (!comment) {
        throw new Error("Comment not found");
      }

      return comment;
    } catch (error) {
      throw new Error(`Error moderating comment: ${error.message}`);
    }
  }
}

module.exports = new CommentService();