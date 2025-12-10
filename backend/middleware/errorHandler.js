/**
 * Custom Error Class — allows throwing custom errors with status codes.
 */
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguish between expected vs unexpected errors
  }
}

/**
 * Main Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  // If response statusCode is still 200, force 500
  let statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message || 'Server Error';

  // ------------------ MONGOOSE ERRORS ------------------
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(el => el.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for: ${Object.keys(err.keyValue).join(', ')}`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
  }

  // ------------------ JWT ERRORS ------------------
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please login again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please login again.';
  }

  // ------------------ LOGGING (DEV MODE) ------------------
  if (process.env.NODE_ENV !== 'production') {
    console.error('--- ERROR LOG START ---');
    console.error(err);
    console.error('--- ERROR LOG END ---');
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

/**
 * 404 Not Found Handler
 */
const notFound = (req, res, next) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
  ApiError
};
