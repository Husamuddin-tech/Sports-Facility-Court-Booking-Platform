const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getBookings,
  getBooking,
  getAvailableSlots,
  checkAvailability,
  calculatePrice,
  createBooking,
  cancelBooking,
  joinWaitlist,
  getMyBookings
} = require('../controllers/bookingController');

/* ==========================
   BOOKING ROUTES
========================== */

// Public routes
router.get('/slots/:courtId/:date', getAvailableSlots);
router.post('/check-availability', checkAvailability);
router.post('/calculate-price', calculatePrice);

// Protected routes (user must be logged in)
router.use(protect);

router.get('/my-bookings', getMyBookings);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.patch('/:id/cancel', cancelBooking);
router.post('/waitlist', joinWaitlist);

module.exports = router;
