require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();


// 🔐 Security Middlewares

app.use(helmet()); // secure HTTP headers

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));

// Gzip compression for faster responses
app.use(compression());

// Rate limit to protect from brute-force attacks
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: "Too many requests. Try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

//  🗄️ Database Connection

let isConnected = false;

// Validate required env vars early
const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

async function connectDB() {
  if (isConnected) return;

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log(`🍃 MongoDB connected → ${connection.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
}

// Initial connection
connectDB();

// Keep DB alive for every request
app.use(async (req, res, next) => {
  try {
    if (!isConnected) await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ error: "Database connection failed." });
  }
});

// 📦 Route Loader (Cleaner & Safer)
const routePaths = {
  auth: "./routes/authRoutes",
  users: "./routes/userRoutes",
  courts: "./routes/courtRoutes",
  coaches: "./routes/coachRoutes",
  equipment: "./routes/equipmentRoutes",
  bookings: "./routes/bookingRoutes",
  pricing: "./routes/pricingRuleRoutes",
  admin: "./routes/adminRoutes",
};

Object.entries(routePaths).forEach(([routeName, path]) => {
  try {
    app.use(`/api/${routeName}`, require(path));
    console.log(`🔗 Route Loaded: /api/${routeName}`);
  } catch (err) {
    console.error(`❌ Failed to load route [${routeName}]: ${err.message}`);
  }
});


// 🏥 Health Check & Root
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    db: isConnected ? "connected" : "disconnected",
    env: process.env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (_, res) => {
  res.json({
    message: "Sports Facility Court Booking API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});


// ❌ 404 & Error Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// 🔥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err);

  return res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 🏁 Start Server + Graceful Shutdown
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Mode: ${process.env.NODE_ENV}`);
});

process.on("SIGINT", async () => {
  console.log("🛑 Graceful shutdown: SIGINT received...");
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});

process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received. Shutting down...");
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});

// Export app for testing
module.exports = app;
