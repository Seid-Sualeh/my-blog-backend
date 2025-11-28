const app = require("./src/app");
const connectDB = require("./src/config/db");
const config = require("./src/config");


// CORS configuration
const cors = require("cors");
// Allow requests only from the specified origin
app.use(cors({
  origin: 'https://seid-blog-app.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Start the server after database connection
async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to connect to the database", err);
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
