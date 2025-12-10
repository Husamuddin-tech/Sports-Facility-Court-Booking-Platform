const Court = require('../models/Court');
const { ApiError } = require('../middleware/errorHandler');
const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all courts
const getCourts = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

    const courts = await Court.find(filters);
    res.json({ success: true, count: courts.length, data: courts });
  } catch (error) {
    next(error);
  }
};

// Get single court
const getCourt = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid court ID', 400);

    const court = await Court.findById(id);
    if (!court) throw new ApiError('Court not found', 404);

    res.json({ success: true, data: court });
  } catch (error) {
    next(error);
  }
};

// Create court
const createCourt = async (req, res, next) => {
  try {
    const allowedFields = ['name','type','description','basePrice','amenities','image'];
    const courtData = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) courtData[f] = req.body[f]; });

    const court = await Court.create(courtData);
    res.status(201).json({ success: true, data: court });
  } catch (error) {
    next(error);
  }
};

// Update court
const updateCourt = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid court ID', 400);

    const allowedFields = ['name','type','description','basePrice','amenities','image'];
    const updateData = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

    const court = await Court.findById(id);
    if (!court) throw new ApiError('Court not found', 404);

    Object.assign(court, updateData);
    const updatedCourt = await court.save();
    res.json({ success: true, data: updatedCourt });
  } catch (error) {
    next(error);
  }
};

// Delete court
const deleteCourt = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid court ID', 400);

    const court = await Court.findById(id);
    if (!court) throw new ApiError('Court not found', 404);

    await court.deleteOne();
    res.json({ success: true, message: 'Court deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Toggle court active status
const toggleCourtStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid court ID', 400);

    const court = await Court.findById(id);
    if (!court) throw new ApiError('Court not found', 404);

    court.isActive = !court.isActive;
    await court.save();
    res.json({ success: true, data: court });
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
  toggleCourtStatus,
};
