const express = require('express');
const router = express.Router();
const { getCoaches, getCoach } = require('../controllers/coachController');

/* ==========================
   COACH ROUTES (PUBLIC)
========================== */

// Get all coaches
router.get('/', getCoaches);

// Get single coach by ID
router.get('/:id', getCoach);

module.exports = router;
