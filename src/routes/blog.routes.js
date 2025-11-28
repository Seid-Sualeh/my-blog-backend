const express = require("express");
const router = express.Router();
const { blogController } = require("../domains");
const { authenticateToken } = require("../middlewares/auth");

// Blog CRUD routes
router.post("/", blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

// Additional blog routes
router.patch("/:id/publish", blogController.togglePublishStatus);
router.get("/writer/:writerId", blogController.getBlogsByWriter);

// Like/Favorite routes (protected)
router.post("/:id/like", authenticateToken, blogController.toggleLike);
router.post("/:id/favorite", authenticateToken, blogController.toggleFavorite);
router.get("/favorites/me", authenticateToken, blogController.getFavoriteBlogs);
router.get("/likes/me", authenticateToken, blogController.getLikedBlogs);

module.exports = router;
