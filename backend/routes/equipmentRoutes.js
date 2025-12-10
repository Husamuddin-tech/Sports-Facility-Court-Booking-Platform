const express = require('express');
const router = express.Router();
const { getEquipment, getEquipmentItem } = require('../controllers/equipmentController');

/* ==========================
   EQUIPMENT ROUTES (PUBLIC)
========================== */

// Get all equipment
router.get('/', getEquipment);

// Get single equipment item by ID
router.get('/:id', getEquipmentItem);

module.exports = router;
