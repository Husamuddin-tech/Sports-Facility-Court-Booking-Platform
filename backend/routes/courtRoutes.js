const express = require('express');
const router = express.Router();
const { getCourts, getCourt } = require('../controllers/courtController');

/* ==========================
   COURT ROUTES (PUBLIC)
========================== */

// Get all courts
router.get('/', getCourts);

// Get single court by ID
router.get('/:id', getCourt);

module.exports = router;
