const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const { errorHandler, notFound } = require('../middleware/errorHandler');

// Load environment variables
dotenv.config();

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
  origin: process.env.CORS_ORIGIN || '*', // Set specific domains in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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

// Error handler
app.use(errorHandler);

// Start server only after DB connection
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });

module.exports = app;
