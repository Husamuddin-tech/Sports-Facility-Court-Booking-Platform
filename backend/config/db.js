const mongoose = require('mongoose');
require('dotenv').config();

// Global cached connection to prevent re-connecting in watch mode / serverless environments
let cached = global.__mongooseConnection;

if (!cached) {
  cached = global.__mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is missing in your environment variables.");
  }

  // If already connected, use cached connection
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");

    const mongooseOptions = {
      maxPoolSize: 10,          // improve scalability
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      writeConcern: { w: "majority" },
      autoIndex: process.env.NODE_ENV !== "production", // disable autoIndex for production
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, mongooseOptions)
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        cached.promise = null; // reset promise on failure
        console.error("❌ Initial MongoDB connection FAILED:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;

    if (process.env.NODE_ENV !== "test") {
      console.log(`✅ MongoDB Connected: ${cached.conn.connection.host}`);
    }

  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }

  return cached.conn;
};

/**
 * Graceful shutdown handler
 * Prevents "Mongoose server disconnected" crashes on restart
 */
process.on("SIGINT", async () => {
  if (cached.conn) {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed due to app termination");
  }
  process.exit(0);
});

module.exports = connectDB;
