const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const AvailabilityChecker = require('../utils/availabilityChecker');
const PricingEngine = require('../utils/pricingEngine');
const { ApiError } = require('../middleware/errorHandler');

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==========================
// GET BOOKINGS
// ==========================
const getBookings = async (req, res, next) => {
  try {
    const { status, date, courtId } = req.query;
    const filter = {};

    if (req.user.role !== 'admin') filter.user = req.user._id;
    if (status) filter.status = status;
    if (courtId && isValidId(courtId)) filter.court = courtId;

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('court', 'name type')
      .populate('resources.coach', 'name hourlyRate')
      .populate('resources.equipment.item', 'name pricePerHour')
      .sort({ date: -1, startTime: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// ==========================
// GET SINGLE BOOKING
// ==========================
const getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid booking ID', 400);

    const booking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('court', 'name type basePrice')
      .populate('resources.coach', 'name hourlyRate specialization')
      .populate('resources.equipment.item', 'name pricePerHour');

    if (!booking) throw new ApiError('Booking not found', 404);

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ApiError('Not authorized', 403);
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// ==========================
// CREATE BOOKING
// ==========================
const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { courtId, coachId, equipment, date, startTime, endTime, notes } = req.body;

    if (!isValidId(courtId)) throw new ApiError('Invalid court ID', 400);

    const court = await Court.findById(courtId);
    if (!court?.isActive) throw new ApiError('Court not available', 400);

    let coach = null;
    if (coachId) {
      if (!isValidId(coachId)) throw new ApiError('Invalid coach ID', 400);
      coach = await Coach.findById(coachId);
      if (!coach?.isActive) throw new ApiError('Coach not available', 400);
    }

    const equipmentInventory = await Equipment.find({ isActive: true });
    const availability = await AvailabilityChecker.checkAllAvailability({
      courtId, coachId, equipment, equipmentInventory, date, startTime, endTime
    });

    if (!availability.available) throw new ApiError('Resources not available', 400);

    const equipmentDetails = (equipment || []).map((item) => {
      const eq = equipmentInventory.find(e => e._id.toString() === item.equipmentId);
      if (!eq) throw new ApiError(`Equipment not found: ${item.equipmentId}`, 404);
      return { equipment: eq, quantity: item.quantity };
    });

    const pricingBreakdown = await PricingEngine.calculatePrice({
      court, coach, equipment: equipmentDetails, date: new Date(date), startTime, endTime
    });

    const booking = await Booking.create([{
      user: req.user._id,
      court: courtId,
      date: new Date(date),
      startTime,
      endTime,
      resources: {
        equipment: (equipment || []).map(e => ({ item: e.equipmentId, quantity: e.quantity })),
        coach: coachId || undefined
      },
      pricingBreakdown,
      notes,
      status: 'confirmed'
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const populatedBooking = await Booking.findById(booking[0]._id)
      .populate('user', 'name email')
      .populate('court', 'name type')
      .populate('resources.coach', 'name hourlyRate')
      .populate('resources.equipment.item', 'name pricePerHour');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// ==========================
// CANCEL BOOKING
// ==========================
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid booking ID', 400);

    const booking = await Booking.findById(id);
    if (!booking) throw new ApiError('Booking not found', 404);

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ApiError('Not authorized', 403);
    }

    if (booking.status === 'cancelled') throw new ApiError('Already cancelled', 400);

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) {
    next(error);
  }
};

// Additional booking controllers (checkAvailability, joinWaitlist, getAvailableSlots, getMyBookings) 
// can be similarly enhanced.

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking,
};
