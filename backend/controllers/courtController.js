const Court = require('../models/Court');

// Helper for 404
const notFoundError = (message = 'Resource not found') => {
  const err = new Error(message);
  err.statusCode = 404;
  throw err;
};

// @desc    Get all courts
// @route   GET /api/courts
// @access  Public
const getCourts = async (req, res, next) => {
  try {
    const filters = {};

    if (req.query.type) filters.type = req.query.type;
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true';
    }

    const courts = await Court.find(filters);

    res.json({
      success: true,
      count: courts.length,
      data: courts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single court
// @route   GET /api/courts/:id
// @access  Public
const getCourt = async (req, res, next) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) notFoundError('Court not found');

    res.json({ success: true, data: court });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new court
// @route   POST /api/admin/courts
// @access  Private/Admin
const createCourt = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'type',
      'description',
      'basePrice',
      'amenities',
      'image'
    ];

    const courtData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) courtData[field] = req.body[field];
    });

    const court = await Court.create(courtData);

    res.status(201).json({
      success: true,
      data: court
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update court
// @route   PUT /api/admin/courts/:id
// @access  Private/Admin
const updateCourt = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'type',
      'description',
      'basePrice',
      'amenities',
      'image'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const court = await Court.findById(req.params.id);
    if (!court) notFoundError('Court not found');

    Object.assign(court, updateData);
    const updatedCourt = await court.save();

    res.json({
      success: true,
      data: updatedCourt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete court
// @route   DELETE /api/admin/courts/:id
// @access  Private/Admin
const deleteCourt = async (req, res, next) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) notFoundError('Court not found');

    await court.deleteOne();

    res.json({
      success: true,
      message: 'Court deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle court active status
// @route   PATCH /api/admin/courts/:id/toggle
// @access  Private/Admin
const toggleCourtStatus = async (req, res, next) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) notFoundError('Court not found');

    court.isActive = !court.isActive;
    await court.save();

    res.json({
      success: true,
      data: court
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourts,
  getCourt,
  createCourt,
  updateCourt,
  deleteCourt,
  toggleCourtStatus
};
