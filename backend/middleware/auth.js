const jwt = require('jsonwebtoken');
const { User } = require('../models'); // auto-loader friendly
const { ApiError } = require('./errorHandler');

// ------------------ PROTECT ROUTES ------------------
const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2️⃣ Optional: Check cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) throw new ApiError('Not authorized. Token missing.', 401);

    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) throw new ApiError('Invalid token.', 401);

    // 4️⃣ Fetch user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new ApiError('User no longer exists.', 401);

    req.user = user;
    next();

  } catch (err) {
    console.error('❌ Auth Error:', err.message);

    // JWT-specific errors
    if (err.name === 'JsonWebTokenError') return next(new ApiError('Invalid token. Please login again.', 401));
    if (err.name === 'TokenExpiredError') return next(new ApiError('Token expired. Please login again.', 401));

    next(err); // forward other errors to main error handler
  }
};

// ------------------ ADMIN ONLY ------------------
const admin = (req, res, next) => {
  if (!req.user) return next(new ApiError('Not authorized. User not found.', 401));
  if (req.user.role !== 'admin') return next(new ApiError('Access denied. Admins only.', 403));
  next();
};

module.exports = { protect, admin };
