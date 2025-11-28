const blogService = require("./blog.service");

class BlogController {
  // Create a new blog
  async createBlog(req, res, next) {
    try {
      const blog = await blogService.createBlog(req.body);
      res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all blogs
  async getAllBlogs(req, res, next) {
    try {
      const result = await blogService.getAllBlogs(req.query);
      res.status(200).json({
        success: true,
        message: "Blogs fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single blog by ID
  async getBlogById(req, res, next) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Blog fetched successfully",
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update blog by ID
  async updateBlog(req, res, next) {
    try {
      const blog = await blogService.updateBlog(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete blog by ID
  async deleteBlog(req, res, next) {
    try {
      const result = await blogService.deleteBlog(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Toggle publish status
  async togglePublishStatus(req, res, next) {
    try {
      const { isPublished } = req.body;
      const blog = await blogService.togglePublishStatus(
        req.params.id,
        isPublished
      );
      res.status(200).json({
        success: true,
        message: `Blog ${
          isPublished ? "published" : "unpublished"
        } successfully`,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get blogs by writer
  async getBlogsByWriter(req, res, next) {
    try {
      const result = await blogService.getBlogsByWriter(
        req.params.writerId,
        req.query
      );
      res.status(200).json({
        success: true,
        message: "Writer's blogs fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BlogController();
