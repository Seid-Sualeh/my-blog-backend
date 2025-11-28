const express = require("express");
const router = express.Router();
const commentController = require("../domains/comment/comment.controller");
const { authenticateToken } = require("../middlewares/auth");
const { validateObjectId, validateQueryParams } = require("../middlewares/validation");
const { body } = require("express-validator");

// Comment validation
const validateCommentCreation = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment content must be between 1 and 1000 characters"),
  body("blog")
    .isMongoId()
    .withMessage("Invalid blog ID"),
  body("parentComment")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent comment ID"),
];

// Public routes
router.get("/blog/:blogId", 
  validateObjectId, 
  validateQueryParams, 
  commentController.getCommentsByBlog
);

router.get("/:id", 
  validateObjectId, 
  commentController.getCommentById
);

router.get("/writer/:writerId", 
  validateObjectId, 
  validateQueryParams, 
  commentController.getCommentsByAuthor
);

// Protected routes (require authentication)
router.post("/", 
  authenticateToken, 
  validateCommentCreation, 
  commentController.createComment
);

router.put("/:id", 
  authenticateToken, 
  validateObjectId, 
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment content must be between 1 and 1000 characters"),
  commentController.updateComment
);

router.delete("/:id", 
  authenticateToken, 
  validateObjectId, 
  commentController.deleteComment
);

router.post("/:id/like", 
  authenticateToken, 
  validateObjectId, 
  commentController.toggleLike
);

// Moderation route (could be admin-only in a real app)
router.patch("/:id/moderate", 
  authenticateToken, 
  validateObjectId, 
  body("isApproved").isBoolean().withMessage("isApproved must be a boolean"),
  commentController.moderateComment
);

module.exports = router;