const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');

/* ==========================
   AUTHENTICATION ROUTES
========================== */
// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (user must be logged in)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
