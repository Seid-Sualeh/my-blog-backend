const app = require("./src/app");
const connectDB = require("./src/config/db");
const config = require("./src/config");

// CORS configuration
const cors = require("cors");

// Allow requests from specified origin or localhost for development
const allowedOrigins = [
  'https://seid-blog-app.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
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
