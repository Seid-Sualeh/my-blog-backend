const writerService = require("./writer.service");

class WriterController {
  // Create a new writer
  async createWriter(req, res, next) {
    try {
      const result = await writerService.createWriter(req.body);
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Create writer error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all writers
  async getAllWriters(req, res, next) {
    try {
      const result = await writerService.getAllWriters(req.query);
      res.status(200).json({
        success: true,
        message: "Writers fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single writer by ID
  async getWriterById(req, res, next) {
    try {
      const writer = await writerService.getWriterById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Writer fetched successfully",
        data: writer,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update writer by ID
  async updateWriter(req, res, next) {
    try {
      const writer = await writerService.updateWriter(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Writer updated successfully",
        data: writer,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete writer by ID
  async deleteWriter(req, res, next) {
    try {
      const result = await writerService.deleteWriter(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get writer stats
  async getWriterStats(req, res, next) {
    try {
      const result = await writerService.getWriterStats(req.params.id);
      res.status(200).json({
        success: true,
        message: "Writer stats fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Deactivate writer
  async deactivateWriter(req, res, next) {
    try {
      const writer = await writerService.deactivateWriter(req.params.id);
      res.status(200).json({
        success: true,
        message: "Writer deactivated successfully",
        data: writer,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WriterController();
