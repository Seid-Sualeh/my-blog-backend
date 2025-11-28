const mongoose = require("mongoose");
const config = require("./index");

async function connectDB() {
  if (!config.mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  // Attempt to connect to the provided URI
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // Mongoose 6+ uses these by default, but explicit options are harmless
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully 🎉 ");
    return conn;
  } catch (err) {
    // throw with additional context so caller can decide how to proceed
    const message = `Could not connect to MongoDB at provided URI. ${err.message}`;
    const enhanced = new Error(message);
    enhanced.original = err;
    throw enhanced;
  }
}

module.exports = connectDB;
