const express = require("express");
const router = express.Router();
const { blogController } = require("../domains");

// Blog CRUD routes
router.post("/", blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

// Additional blog routes
router.patch("/:id/publish", blogController.togglePublishStatus);
router.get("/writer/:writerId", blogController.getBlogsByWriter);

module.exports = router;
