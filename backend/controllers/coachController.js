const Coach = require('../models/Coach');
const { ApiError } = require('../middleware/errorHandler');
const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all coaches
// @route   GET /api/coaches
// @access  Public
const getCoaches = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

    const coaches = await Coach.find(filters);
    res.json({ success: true, count: coaches.length, data: coaches });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single coach
// @route   GET /api/coaches/:id
// @access  Public
const getCoach = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid coach ID', 400);

    const coach = await Coach.findById(id);
    if (!coach) throw new ApiError('Coach not found', 404);

    res.json({ success: true, data: coach });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coach
// @route   POST /api/admin/coaches
// @access  Private/Admin
const createCoach = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'email', 'phone', 'specialization',
      'experience', 'hourlyRate', 'bio', 'image', 'availability'
    ];
    const coachData = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) coachData[f] = req.body[f]; });

    const coach = await Coach.create(coachData);
    res.status(201).json({ success: true, data: coach });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coach
// @route   PUT /api/admin/coaches/:id
// @access  Private/Admin
const updateCoach = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid coach ID', 400);

    const allowedFields = [
      'name', 'email', 'phone', 'specialization',
      'experience', 'hourlyRate', 'bio', 'image', 'availability'
    ];
    const updateData = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

    const coach = await Coach.findById(id);
    if (!coach) throw new ApiError('Coach not found', 404);

    Object.assign(coach, updateData);
    const updatedCoach = await coach.save();
    res.json({ success: true, data: updatedCoach });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coach
// @route   DELETE /api/admin/coaches/:id
// @access  Private/Admin
const deleteCoach = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid coach ID', 400);

    const coach = await Coach.findById(id);
    if (!coach) throw new ApiError('Coach not found', 404);

    await coach.deleteOne();
    res.json({ success: true, message: 'Coach deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle coach active status
// @route   PATCH /api/admin/coaches/:id/toggle
// @access  Private/Admin
const toggleCoachStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid coach ID', 400);

    const coach = await Coach.findById(id);
    if (!coach) throw new ApiError('Coach not found', 404);

    coach.isActive = !coach.isActive;
    await coach.save();
    res.json({ success: true, data: coach });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coach availability
// @route   PUT /api/admin/coaches/:id/availability
// @access  Private/Admin
const updateCoachAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid coach ID', 400);

    if (!req.body.availability) throw new ApiError('Availability data is required', 400);

    const coach = await Coach.findById(id);
    if (!coach) throw new ApiError('Coach not found', 404);

    coach.availability = new Map(Object.entries(req.body.availability));
    await coach.save();

    res.json({ success: true, data: coach });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoaches,
  getCoach,
  createCoach,
  updateCoach,
  deleteCoach,
  toggleCoachStatus,
  updateCoachAvailability,
};
