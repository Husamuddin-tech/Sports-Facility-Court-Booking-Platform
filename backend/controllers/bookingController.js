const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const AvailabilityChecker = require('../utils/availabilityChecker');
const PricingEngine = require('../utils/pricingEngine');
const { ApiError } = require('../middleware/errorHandler');

// ==========================
// GET ALL BOOKINGS
// ==========================
const getBookings = async (req, res, next) => {
  try {
    const { status, date, courtId } = req.query;
    const filter = {};

    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    if (status) filter.status = status;
    if (courtId) filter.court = courtId;

    if (date) {
      const bookingDate = new Date(date);
      bookingDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(bookingDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.date = { $gte: bookingDate, $lt: nextDay };
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
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('court', 'name type basePrice')
      .populate('resources.coach', 'name hourlyRate specialization')
      .populate('resources.equipment.item', 'name pricePerHour');

    if (!booking) throw new ApiError('Booking not found', 404);

    const owner = booking.user._id.toString();
    const requester = req.user._id.toString();

    if (owner !== requester && req.user.role !== 'admin') {
      throw new ApiError('Not authorized to view this booking', 403);
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// ==========================
// GET AVAILABLE SLOTS
// ==========================
const getAvailableSlots = async (req, res, next) => {
  try {
    const { courtId, date } = req.params;

    const slots = await AvailabilityChecker.getAvailableSlots(
      courtId,
      new Date(date)
    );

    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
};

// ==========================
// CHECK AVAILABILITY
// ==========================
const checkAvailability = async (req, res, next) => {
  try {
    const { courtId, coachId, equipment, date, startTime, endTime } = req.body;

    const equipmentInventory = await Equipment.find({ isActive: true });

    const result = await AvailabilityChecker.checkAllAvailability({
      courtId,
      coachId,
      equipment,
      equipmentInventory,
      date,
      startTime,
      endTime
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// ==========================
// CALCULATE PRICE
// ==========================
const calculatePrice = async (req, res, next) => {
  try {
    const { courtId, coachId, equipment, date, startTime, endTime } = req.body;

    const court = await Court.findById(courtId);
    if (!court) throw new ApiError('Court not found', 404);

    let coach = null;
    if (coachId) {
      coach = await Coach.findById(coachId);
    }

    const equipmentWithDetails = [];
    if (equipment?.length) {
      for (const item of equipment) {
        const found = await Equipment.findById(item.equipmentId);
        if (found) {
          equipmentWithDetails.push({
            equipment: found,
            quantity: item.quantity
          });
        }
      }
    }

    const pricing = await PricingEngine.calculatePrice({
      court,
      date: new Date(date),
      startTime,
      endTime,
      equipment: equipmentWithDetails,
      coach
    });

    res.json({ success: true, data: pricing });
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

    const court = await Court.findById(courtId);
    if (!court || !court.isActive) throw new ApiError('Court not available', 400);

    let coach = null;
    if (coachId) {
      coach = await Coach.findById(coachId);
      if (!coach || !coach.isActive) throw new ApiError('Coach not available', 400);
    }

    const equipmentInventory = await Equipment.find({ isActive: true });

    const availability = await AvailabilityChecker.checkAllAvailability({
      courtId,
      coachId,
      equipment,
      equipmentInventory,
      date,
      startTime,
      endTime
    });

    if (!availability.available) {
      throw new ApiError('Resources are not available', 400);
    }

    // Equipment details for pricing
    const equipmentWithDetails = [];
    const bookingEquipment = [];

    if (equipment?.length) {
      for (const item of equipment) {
        const found = equipmentInventory.find(
          e => e._id.toString() === item.equipmentId
        );

        if (found) {
          equipmentWithDetails.push({
            equipment: found,
            quantity: item.quantity
          });

          bookingEquipment.push({
            item: item.equipmentId,
            quantity: item.quantity
          });
        }
      }
    }

    const pricing = await PricingEngine.calculatePrice({
      court,
      date: new Date(date),
      startTime,
      endTime,
      equipment: equipmentWithDetails,
      coach
    });

    const booking = await Booking.create([{
      user: req.user._id,
      court: courtId,
      date: new Date(date),
      startTime,
      endTime,
      resources: {
        equipment: bookingEquipment,
        coach: coachId || undefined
      },
      pricingBreakdown: pricing,
      notes,
      status: 'confirmed'
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Booking.findById(booking[0]._id)
      .populate('user', 'name email')
      .populate('court', 'name type')
      .populate('resources.coach', 'name hourlyRate')
      .populate('resources.equipment.item', 'name pricePerHour');

    res.status(201).json({ success: true, data: populated });

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
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError('Booking not found', 404);

    const owner = booking.user.toString();
    const requester = req.user._id.toString();

    if (owner !== requester && req.user.role !== 'admin') {
      throw new ApiError('Not authorized to cancel this booking', 403);
    }

    if (booking.status === 'cancelled') {
      throw new ApiError('Booking already cancelled', 400);
    }

    booking.status = 'cancelled';
    await booking.save();

    // Waitlist logic
    const nextInWaitlist = await Booking.find({
      court: booking.court,
      date: booking.date,
      status: 'waitlist'
    }).sort({ waitlistPosition: 1 }).limit(1);

    if (nextInWaitlist.length) {
      nextInWaitlist[0].notifiedAt = new Date();
      await nextInWaitlist[0].save();
    }

    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) {
    next(error);
  }
};

// ==========================
// JOIN WAITLIST
// ==========================
const joinWaitlist = async (req, res, next) => {
  try {
    const { courtId, coachId, equipment, date, startTime, endTime, notes } = req.body;

    const existingWaitlist = await Booking.find({
      court: courtId,
      date: new Date(date),
      startTime,
      endTime,
      status: 'waitlist'
    });

    const position = existingWaitlist.length + 1;

    const booking = await Booking.create({
      user: req.user._id,
      court: courtId,
      date: new Date(date),
      startTime,
      endTime,
      resources: {
        equipment: equipment?.map(e => ({ item: e.equipmentId, quantity: e.quantity })) || [],
        coach: coachId
      },
      pricingBreakdown: { total: 0 },
      notes,
      status: 'waitlist',
      waitlistPosition: position
    });

    const populated = await Booking.findById(booking._id)
      .populate('court', 'name type')
      .populate('resources.coach', 'name');

    res.status(201).json({
      success: true,
      message: `Joined waitlist at position ${position}`,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// USER'S BOOKING HISTORY
// ==========================
const getMyBookings = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate('court', 'name type')
      .populate('resources.coach', 'name')
      .populate('resources.equipment.item', 'name')
      .sort({ date: -1, startTime: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  getBooking,
  getAvailableSlots,
  checkAvailability,
  calculatePrice,
  createBooking,
  cancelBooking,
  joinWaitlist,
  getMyBookings
};
