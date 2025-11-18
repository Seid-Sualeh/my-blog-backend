const blogController = require("./blog/blog.controller");
const blogService = require("./blog/blog.service");
const writerController = require("./writer/writer.controller");
const writerService = require("./writer/writer.service");

module.exports = {
  blogController,
  blogService,
  writerController,
  writerService,
};
