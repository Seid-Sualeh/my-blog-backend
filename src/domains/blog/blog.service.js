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

  // Like/unlike blog
  async toggleLike(blogId, writerId) {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog) {
        throw new Error("Blog not found");
      }

      const hasLiked = blog.likes.includes(writerId);

      if (hasLiked) {
        // Unlike
        await Blog.findByIdAndUpdate(blogId, {
          $pull: { likes: writerId }
        });
        return { liked: false, message: "Blog unliked" };
      } else {
        // Like
        await Blog.findByIdAndUpdate(blogId, {
          $addToSet: { likes: writerId }
        });
        return { liked: true, message: "Blog liked" };
      }
    } catch (error) {
      throw new Error(`Error toggling like: ${error.message}`);
    }
  }

  // Add/remove blog from favorites
  async toggleFavorite(blogId, writerId) {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog) {
        throw new Error("Blog not found");
      }

      const hasFavorited = blog.favorites.includes(writerId);

      if (hasFavorited) {
        // Remove from favorites
        await Blog.findByIdAndUpdate(blogId, {
          $pull: { favorites: writerId }
        });
        return { favorited: false, message: "Blog removed from favorites" };
      } else {
        // Add to favorites
        await Blog.findByIdAndUpdate(blogId, {
          $addToSet: { favorites: writerId }
        });
        return { favorited: true, message: "Blog added to favorites" };
      }
    } catch (error) {
      throw new Error(`Error toggling favorite: ${error.message}`);
    }
  }

  // Get user's favorite blogs
  async getFavoriteBlogs(writerId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = { 
        favorites: writerId,
        isPublished: true 
      };

      const blogs = await Blog.find(query)
        .populate("writer", "name email profileImage")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Blog.countDocuments(query);

      return {
        blogs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching favorite blogs: ${error.message}`);
    }
  }

  // Get user's liked blogs
  async getLikedBlogs(writerId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = { 
        likes: writerId,
        isPublished: true 
      };

      const blogs = await Blog.find(query)
        .populate("writer", "name email profileImage")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Blog.countDocuments(query);

      return {
        blogs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching liked blogs: ${error.message}`);
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
