const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ApiError } = require('./errorHandler');

// ------------------ PROTECT ROUTES ------------------
const protect = async (req, res, next) => {
  try {
    let token;

    console.log("\n================ AUTH DEBUG ================");
    console.log("Incoming Authorization Header:", req.headers.authorization);
    console.log("Cookies:", req.cookies);

    // 1️⃣ Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2️⃣ Check cookies fallback
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    console.log("Extracted Token:", token);

    if (!token) {
      console.log("❌ No token found in header/cookies");
      throw new ApiError('Not authorized. Token missing.', 401);
    }

    console.log("JWT_SECRET being used:", process.env.JWT_SECRET);

    // 3️⃣ Verify JWT Signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token Payload:", decoded);

    if (!decoded?.id) {
      console.log("❌ Token decoded but missing user ID");
      throw new ApiError('Invalid token.', 401);
    }

    // 4️⃣ Fetch user from DB
    const user = await User.findById(decoded.id).select('-password');

    console.log("User fetched from DB:", user ? user.email : "User not found");

    if (!user) throw new ApiError('User no longer exists.', 401);

    req.user = user;

    console.log("✅ AUTH SUCCESS — User authorized:", user.email);
    console.log("===========================================\n");

    next();

  } catch (err) {
    console.error("❌ AUTH ERROR:", err.message);

    if (err.name === 'JsonWebTokenError')
      return next(new ApiError('Invalid token. Please login again.', 401));

    if (err.name === 'TokenExpiredError')
      return next(new ApiError('Token expired. Please login again.', 401));

    next(err);
  }
};

// ------------------ ADMIN ONLY ------------------
const admin = (req, res, next) => {
  console.log('User role:', req.user?.role);
  if (!req.user) return next(new ApiError('Not authorized. User not found.', 401));
  if (req.user.role !== 'admin') return next(new ApiError('Access denied. Admins only.', 403));
  next();
};

module.exports = { protect, admin };
