const PricingRule = require('../models/PricingRule');
const { ApiError } = require('../middleware/errorHandler');
const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all pricing rules
const getPricingRules = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
    if (req.query.type) filters.type = req.query.type;

    const rules = await PricingRule.find(filters).sort({ priority: -1 });
    res.json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    next(error);
  }
};

// Get single pricing rule
const getPricingRule = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid pricing rule ID', 400);

    const rule = await PricingRule.findById(id);
    if (!rule) throw new ApiError('Pricing rule not found', 404);

    res.json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

// Create pricing rule
const createPricingRule = async (req, res, next) => {
  try {
    const allowedFields = [
      'name','description','type','startTime','endTime','applicableDays',
      'specificDates','modifierType','modifierValue','appliesTo','priority','isActive'
    ];
    const data = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });

    const rule = await PricingRule.create(data);
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

// Update pricing rule
const updatePricingRule = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid pricing rule ID', 400);

    const allowedFields = [
      'name','description','type','startTime','endTime','applicableDays',
      'specificDates','modifierType','modifierValue','appliesTo','priority','isActive'
    ];
    const updateData = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

    const rule = await PricingRule.findById(id);
    if (!rule) throw new ApiError('Pricing rule not found', 404);

    Object.assign(rule, updateData);
    const updated = await rule.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// Delete pricing rule
const deletePricingRule = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid pricing rule ID', 400);

    const rule = await PricingRule.findById(id);
    if (!rule) throw new ApiError('Pricing rule not found', 404);

    await rule.deleteOne();
    res.json({ success: true, message: 'Pricing rule deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Toggle active status
const togglePricingRuleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError('Invalid pricing rule ID', 400);

    const rule = await PricingRule.findById(id);
    if (!rule) throw new ApiError('Pricing rule not found', 404);

    rule.isActive = !rule.isActive;
    await rule.save();
    res.json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPricingRules,
  getPricingRule,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  togglePricingRuleStatus,
};
