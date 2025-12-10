const express = require('express');
const router = express.Router();
const { getPricingRules, getPricingRule } = require('../controllers/pricingRuleController');

/* ==============================
   PRICING RULE ROUTES (PUBLIC)
============================== */

// Get all pricing rules
router.get('/', getPricingRules);

// Get single pricing rule by ID
router.get('/:id', getPricingRule);

module.exports = router;
