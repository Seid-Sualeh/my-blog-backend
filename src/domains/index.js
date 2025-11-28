const blogController = require("./blog/blog.controller");
const blogService = require("./blog/blog.service");
const writerController = require("./writer/writer.controller");
const writerService = require("./writer/writer.service");
const authController = require("./auth/auth.controller");
const authService = require("./auth/auth.service");

module.exports = {
  blogController,
  blogService,
  writerController,
  writerService,
  authController,
  authService,
};
