const commentService = require("./comment.service");
const { authenticateToken } = require("../../middlewares/auth");
const { validateObjectId, validateQueryParams } = require("../../middlewares/validation");

class CommentController {
  // Create a new comment
  async createComment(req, res, next) {
    try {
      const commentData = {
        ...req.body,
        author: req.writerId,
      };

      const comment = await commentService.createComment(commentData);

      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all comments for a blog
  async getCommentsByBlog(req, res, next) {
    try {
      const { blogId } = req.params;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
      };

      const result = await commentService.getCommentsByBlog(blogId, options);

      res.status(200).json({
        success: true,
        message: "Comments fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single comment by ID
  async getCommentById(req, res, next) {
    try {
      const { id } = req.params;
      const comment = await commentService.getCommentById(id);

      res.status(200).json({
        success: true,
        message: "Comment fetched successfully",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update comment
  async updateComment(req, res, next) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      const comment = await commentService.updateComment(id, { content }, req.writerId);

      res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete comment
  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const result = await commentService.deleteComment(id, req.writerId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Like/unlike comment
  async toggleLike(req, res, next) {
    try {
      const { id } = req.params;
      const result = await commentService.toggleLike(id, req.writerId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: { liked: result.liked },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get comments by author
  async getCommentsByAuthor(req, res, next) {
    try {
      const { writerId } = req.params;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
      };

      const result = await commentService.getCommentsByAuthor(writerId, options);

      res.status(200).json({
        success: true,
        message: "Author's comments fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Moderate comment (approve/reject)
  async moderateComment(req, res, next) {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;

      const comment = await commentService.moderateComment(id, isApproved);

      res.status(200).json({
        success: true,
        message: `Comment ${isApproved ? "approved" : "rejected"} successfully`,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();