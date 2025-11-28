const express = require("express");
const router = express.Router();
const blogRoutes = require("./blog.routes");
const writerRoutes = require("./writer.routes");
const authRoutes = require("./auth.routes");
const commentRoutes = require("./comment.routes");

// API routes
router.use("/blog", blogRoutes);
router.use("/writer", writerRoutes);
router.use("/auth", authRoutes);
router.use("/comments", commentRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog API is running successfully",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
