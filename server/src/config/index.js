const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = config;
