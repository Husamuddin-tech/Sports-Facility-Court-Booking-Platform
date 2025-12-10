const Equipment = require('../models/Equipment');

// Helper for 404
const notFoundError = (message = 'Resource not found') => {
  const err = new Error(message);
  err.statusCode = 404;
  throw err;
};

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
const getEquipment = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true';
    }

    const equipmentList = await Equipment.find(filters);

    res.json({
      success: true,
      count: equipmentList.length,
      data: equipmentList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single equipment item
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentItem = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) notFoundError('Equipment not found');

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new equipment
// @route   POST /api/admin/equipment
// @access  Private/Admin
const createEquipment = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'type',
      'description',
      'totalQuantity',
      'pricePerHour',
      'image'
    ];

    const equipmentData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) equipmentData[field] = req.body[field];
    });

    const equipment = await Equipment.create(equipmentData);

    res.status(201).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment
// @route   PUT /api/admin/equipment/:id
// @access  Private/Admin
const updateEquipment = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'type',
      'description',
      'totalQuantity',
      'pricePerHour',
      'image',
      'isActive'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) notFoundError('Equipment not found');

    Object.assign(equipment, updateData);
    const updatedEquipment = await equipment.save();

    res.json({
      success: true,
      data: updatedEquipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment
// @route   DELETE /api/admin/equipment/:id
// @access  Private/Admin
const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) notFoundError('Equipment not found');

    await equipment.deleteOne();

    res.json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle equipment active status
// @route   PATCH /api/admin/equipment/:id/toggle
// @access  Private/Admin
const toggleEquipmentStatus = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) notFoundError('Equipment not found');

    equipment.isActive = !equipment.isActive;
    await equipment.save();

    res.json({
      success: true,
      data: equipment
    });
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
  toggleEquipmentStatus
};
