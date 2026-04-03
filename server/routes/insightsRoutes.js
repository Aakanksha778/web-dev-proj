const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getInsights } = require('../controllers/insightsController');

router.get('/', authenticate, getInsights);

module.exports = router;
