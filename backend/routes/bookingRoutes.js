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
router.post('/calculate-price', calculatePrice);

// Protected routes (user must be logged in)
router.use(protect); // everything below requires authentication

// Static protected routes first
router.post('/check-availability', checkAvailability);
router.get('/my-bookings', getBookings);
router.post('/waitlist', joinWaitlist);
router.post('/', createBooking);
router.patch('/:id/cancel', cancelBooking);

// Dynamic route last
router.get('/:id', getBooking);
router.get('/', getBookings);

module.exports = router;







// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const {
//   getBookings,
//   getBooking,
//   getAvailableSlots,
//   checkAvailability,
//   calculatePrice,
//   createBooking,
//   cancelBooking,
//   joinWaitlist,
//   getMyBookings
// } = require('../controllers/bookingController');

// /* ==========================
//    BOOKING ROUTES
// ========================== */

// // Public routes (no auth)
// router.get('/slots/:courtId/:date', getAvailableSlots);
// router.post('/calculate-price', calculatePrice);

// // Protected routes (user must be logged in)
// router.use(protect); // everything below requires authentication

// router.post('/check-availability', checkAvailability); // protected
// router.get('/my-bookings', getMyBookings);
// router.get('/', getBookings);
// router.get('/:id', getBooking);
// router.post('/', createBooking);
// router.patch('/:id/cancel', cancelBooking);
// router.post('/waitlist', joinWaitlist);

// module.exports = router;
