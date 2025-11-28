const Writer = require("./writer.model");
const Blog = require("../blog/blog.model");

class WriterService {
  // Create a new writer
  async createWriter(writerData) {
    try {
      const writer = new Writer(writerData);
      return await writer.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Email already exists");
      }
      throw new Error(`Error creating writer: ${error.message}`);
    }
  }

  // Get all writers with optional filtering
  async getAllWriters(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        search = "",
        isActive = null,
      } = options;

      // Build query
      let query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      if (isActive !== null) {
        query.isActive = isActive;
      }

      // Execute query with blog count
      const writers = await Writer.find(query)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate("blogCount")
        .exec();

      // Get total count for pagination
      const total = await Writer.countDocuments(query);

      return {
        writers,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching writers: ${error.message}`);
    }
  }

  // Get single writer by ID
  async getWriterById(id) {
    try {
      const writer = await Writer.findById(id).populate("blogCount");

      if (!writer) {
        throw new Error("Writer not found");
      }
      return writer;
    } catch (error) {
      throw new Error(`Error fetching writer: ${error.message}`);
    }
  }

  // Update writer by ID
  async updateWriter(id, updateData) {
    try {
      const writer = await Writer.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("blogCount");

      if (!writer) {
        throw new Error("Writer not found");
      }
      return writer;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Email already exists");
      }
      throw new Error(`Error updating writer: ${error.message}`);
    }
  }

  // Delete writer by ID
  async deleteWriter(id) {
    try {
      // Check if writer has blogs
      const blogCount = await Blog.countDocuments({ writer: id });
      if (blogCount > 0) {
        throw new Error(
          "Cannot delete writer with existing blogs. Please reassign or delete the blogs first."
        );
      }

      const writer = await Writer.findByIdAndDelete(id);
      if (!writer) {
        throw new Error("Writer not found");
      }
      return { message: "Writer deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting writer: ${error.message}`);
    }
  }

  // Get writer stats
  async getWriterStats(id) {
    try {
      const writer = await this.getWriterById(id);
      const publishedBlogs = await Blog.countDocuments({
        writer: id,
        isPublished: true,
      });
      const totalBlogs = await Blog.countDocuments({ writer: id });

      return {
        writer,
        stats: {
          totalBlogs,
          publishedBlogs,
          draftBlogs: totalBlogs - publishedBlogs,
        },
      };
    } catch (error) {
      throw new Error(`Error fetching writer stats: ${error.message}`);
    }
  }

  // Deactivate writer (soft delete)
  async deactivateWriter(id) {
    try {
      return await this.updateWriter(id, { isActive: false });
    } catch (error) {
      throw new Error(`Error deactivating writer: ${error.message}`);
    }
  }
}

module.exports = new WriterService();
