const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');

// Controllers
const {
  createCourt,
  updateCourt,
  deleteCourt,
  toggleCourtStatus
} = require('../controllers/courtController');

const {
  createCoach,
  updateCoach,
  deleteCoach,
  toggleCoachStatus,
  updateCoachAvailability
} = require('../controllers/coachController');

const {
  createEquipment,
  updateEquipment,
  deleteEquipment,
  toggleEquipmentStatus
} = require('../controllers/equipmentController');

const {
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  togglePricingRuleStatus
} = require('../controllers/pricingRuleController');

// Apply protection and admin middleware to all admin routes
router.use(protect, admin);

/* ==========================
   COURT MANAGEMENT
========================== */
router.route('/courts')
  .post(createCourt);

router.route('/courts/:id')
  .put(updateCourt)
  .delete(deleteCourt);

router.route('/courts/:id/toggle')
  .patch(toggleCourtStatus);

/* ==========================
   COACH MANAGEMENT
========================== */
router.route('/coaches')
  .post(createCoach);

router.route('/coaches/:id')
  .put(updateCoach)
  .delete(deleteCoach);

router.route('/coaches/:id/toggle')
  .patch(toggleCoachStatus);

router.route('/coaches/:id/availability')
  .put(updateCoachAvailability);

/* ==========================
   EQUIPMENT MANAGEMENT
========================== */
router.route('/equipment')
  .post(createEquipment);

router.route('/equipment/:id')
  .put(updateEquipment)
  .delete(deleteEquipment);

router.route('/equipment/:id/toggle')
  .patch(toggleEquipmentStatus);

/* ==========================
   PRICING RULE MANAGEMENT
========================== */
router.route('/pricing-rules')
  .post(createPricingRule);

router.route('/pricing-rules/:id')
  .put(updatePricingRule)
  .delete(deletePricingRule);

router.route('/pricing-rules/:id/toggle')
  .patch(togglePricingRuleStatus);

module.exports = router;
