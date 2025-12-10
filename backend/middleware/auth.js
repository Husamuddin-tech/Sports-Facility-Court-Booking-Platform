const jwt = require('jsonwebtoken');
const { User } = require('../models'); // auto-loader friendly

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2️⃣ (Optional) Check cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 3️⃣ If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Token missing.'
      });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // 5️⃣ Fetch user and attach to request
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('❌ Auth Error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token verification failed.'
    });
  }
};

// Admin-only routes
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. User not found.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }

  next();
};

module.exports = { protect, admin };
