const PricingRule = require('../models/PricingRule');

// Helper for 404
const notFoundError = (message = 'Resource not found') => {
  const err = new Error(message);
  err.statusCode = 404;
  throw err;
};

// @desc    Get all pricing rules
// @route   GET /api/pricing-rules
// @access  Public
const getPricingRules = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
    if (req.query.type) filters.type = req.query.type;

    const rules = await PricingRule.find(filters).sort({ priority: -1 });

    res.json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pricing rule
// @route   GET /api/pricing-rules/:id
// @access  Public
const getPricingRule = async (req, res, next) => {
  try {
    const rule = await PricingRule.findById(req.params.id);
    if (!rule) notFoundError('Pricing rule not found');

    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create pricing rule
// @route   POST /api/admin/pricing-rules
// @access  Private/Admin
const createPricingRule = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'description',
      'type',
      'startTime',
      'endTime',
      'applicableDays',
      'specificDates',
      'modifierType',
      'modifierValue',
      'appliesTo',
      'priority',
      'isActive'
    ];

    const ruleData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) ruleData[field] = req.body[field];
    });

    const rule = await PricingRule.create(ruleData);

    res.status(201).json({
      success: true,
      data: rule
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pricing rule
// @route   PUT /api/admin/pricing-rules/:id
// @access  Private/Admin
const updatePricingRule = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'description',
      'type',
      'startTime',
      'endTime',
      'applicableDays',
      'specificDates',
      'modifierType',
      'modifierValue',
      'appliesTo',
      'priority',
      'isActive'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const rule = await PricingRule.findById(req.params.id);
    if (!rule) notFoundError('Pricing rule not found');

    Object.assign(rule, updateData);
    const updatedRule = await rule.save();

    res.json({
      success: true,
      data: updatedRule
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pricing rule
// @route   DELETE /api/admin/pricing-rules/:id
// @access  Private/Admin
const deletePricingRule = async (req, res, next) => {
  try {
    const rule = await PricingRule.findById(req.params.id);
    if (!rule) notFoundError('Pricing rule not found');

    await rule.deleteOne();

    res.json({
      success: true,
      message: 'Pricing rule deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pricing rule active status
// @route   PATCH /api/admin/pricing-rules/:id/toggle
// @access  Private/Admin
const togglePricingRuleStatus = async (req, res, next) => {
  try {
    const rule = await PricingRule.findById(req.params.id);
    if (!rule) notFoundError('Pricing rule not found');

    rule.isActive = !rule.isActive;
    await rule.save();

    res.json({
      success: true,
      data: rule
    });
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
  togglePricingRuleStatus
};
