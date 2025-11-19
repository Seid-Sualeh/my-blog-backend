const app = require("./src/app");
const connectDB = require("./src/config/db");
const config = require("./src/config");

// Start the server after database connection
async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection error:");
    console.error(err.message || err);
    console.error("\nTroubleshooting tips:");
    console.error(
      "- If using MongoDB Atlas, ensure your current IP is whitelisted (Network Access)"
    );
    console.error(
      "- Confirm the URI includes the database name and correct credentials:"
    );
    console.error(
      "  mongodb+srv://<user>:<pass>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority"
    );
    console.error(
      "- If you intended to use a local MongoDB, update MONGO_URI in .env to a local URI such as:"
    );
    console.error("  mongodb://localhost:27017/blog-api");
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
   
    // console.log(`📍 API available at http://localhost:${config.port}/api`);
    // console.log(`❤️  Health check: http://localhost:${config.port}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", err);
    server.close(() => process.exit(1));
  });
}

start();
