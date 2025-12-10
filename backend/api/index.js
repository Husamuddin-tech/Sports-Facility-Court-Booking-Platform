const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const { errorHandler, notFound } = require('../middleware/errorHandler');
const morgan = require('morgan'); // Logging middleware

// Route imports
const authRoutes = require('../routes/authRoutes');
const courtRoutes = require('../routes/courtRoutes');
const coachRoutes = require('../routes/coachRoutes');
const equipmentRoutes = require('../routes/equipmentRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const pricingRuleRoutes = require('../routes/pricingRuleRoutes');
const adminRoutes = require('../routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Adjust in production to restrict domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to database before handling requests
connectDB().then(() => {
  console.log('MongoDB connected successfully');
}).catch((error) => {
  console.error('Database connection failed:', error.message);
  process.exit(1); // Stop server if DB fails
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing-rules', pricingRuleRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Court Booking API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Court Booking API - Use /api endpoints' });
});

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
