const mongoose = require('mongoose');
require('dotenv').config();
const winston = require('winston'); // Optional production logger

// Logger setup (console fallback if winston not configured)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

// Global cached connection to prevent re-connecting
let cached = global.__mongooseConnection;
if (!cached) cached = global.__mongooseConnection = { conn: null, promise: null };

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is missing in environment variables.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    logger.info("⏳ Connecting to MongoDB...");

    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      writeConcern: { w: "majority" },
      autoIndex: process.env.NODE_ENV !== "production",
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, options)
      .then((mongooseInstance) => {
        logger.info("✅ MongoDB connection established.");
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        logger.error("❌ MongoDB connection failed:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    logger.error("❌ MongoDB connection error:", error.message);
    throw error;
  }

  return cached.conn;
};

// Graceful shutdown
process.on("SIGINT", async () => {
  if (cached.conn) {
    await mongoose.connection.close();
    logger.info("🔌 MongoDB connection closed due to app termination");
  }
  process.exit(0);
});

module.exports = connectDB;
