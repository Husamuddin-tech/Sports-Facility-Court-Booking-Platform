const Equipment = require('../models/Equipment');
const { ApiError } = require('../middleware/errorHandler');
const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all equipment
const getEquipment = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

    const items = await Equipment.find(filters);
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

// Get single equipment
const getEquipmentItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid equipment ID', 400);

    const item = await Equipment.findById(id);
    if (!item) throw new ApiError('Equipment not found', 404);

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// Create equipment
const createEquipment = async (req, res, next) => {
  try {
    const allowedFields = ['name','type','description','totalQuantity','pricePerHour','image'];
    const data = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });

    const item = await Equipment.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// Update equipment
const updateEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid equipment ID', 400);

    const allowedFields = ['name','type','description','totalQuantity','pricePerHour','image','isActive'];
    const updateData = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

    const item = await Equipment.findById(id);
    if (!item) throw new ApiError('Equipment not found', 404);

    Object.assign(item, updateData);
    const updated = await item.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// Delete equipment
const deleteEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid equipment ID', 400);

    const item = await Equipment.findById(id);
    if (!item) throw new ApiError('Equipment not found', 404);

    await item.deleteOne();
    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Toggle active status
const toggleEquipmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid equipment ID', 400);

    const item = await Equipment.findById(id);
    if (!item) throw new ApiError('Equipment not found', 404);

    item.isActive = !item.isActive;
    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEquipment,
  getEquipmentItem,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  toggleEquipmentStatus,
};
