const Blog = require("./blog.model");

class BlogService {
  // Create a new blog
  async createBlog(blogData) {
    try {
      const blog = new Blog(blogData);
      return await blog.save();
    } catch (error) {
      throw new Error(`Error creating blog: ${error.message}`);
    }
  }

  // Get all blogs with optional filtering and pagination
  async getAllBlogs(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        search = "",
        writerId = null,
        isPublished = null,
      } = options;

      // Build query
      let query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      if (writerId) {
        query.writer = writerId;
      }

      if (isPublished !== null) {
        query.isPublished = isPublished;
      }

      // Execute query with population
      const blogs = await Blog.find(query)
        .populate("writer", "name email profileImage")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      // Get total count for pagination
      const total = await Blog.countDocuments(query);

      return {
        blogs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching blogs: ${error.message}`);
    }
  }

  // Get single blog by ID
  async getBlogById(id) {
    try {
      const blog = await Blog.findById(id).populate(
        "writer",
        "name email bio profileImage socialLinks"
      );

      if (!blog) {
        throw new Error("Blog not found");
      }
      return blog;
    } catch (error) {
      throw new Error(`Error fetching blog: ${error.message}`);
    }
  }

  // Update blog by ID
  async updateBlog(id, updateData) {
    try {
      const blog = await Blog.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("writer", "name email profileImage");

      if (!blog) {
        throw new Error("Blog not found");
      }
      return blog;
    } catch (error) {
      throw new Error(`Error updating blog: ${error.message}`);
    }
  }

  // Delete blog by ID
  async deleteBlog(id) {
    try {
      const blog = await Blog.findByIdAndDelete(id);
      if (!blog) {
        throw new Error("Blog not found");
      }
      return { message: "Blog deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting blog: ${error.message}`);
    }
  }

  // Get blogs by writer
  async getBlogsByWriter(writerId, options = {}) {
    try {
      const query = { writer: writerId, ...options };
      return await this.getAllBlogs(query);
    } catch (error) {
      throw new Error(`Error fetching writer's blogs: ${error.message}`);
    }
  }

  // Publish/unpublish blog
  async togglePublishStatus(id, isPublished) {
    try {
      const updateData = { isPublished };
      if (isPublished) {
        updateData.publishedAt = new Date();
      }
      return await this.updateBlog(id, updateData);
    } catch (error) {
      throw new Error(`Error updating publish status: ${error.message}`);
    }
  }
}

module.exports = new BlogService();
