const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getSummary, getSpendingTrend, getCategorySplit, getBudgetVsActual } = require('../controllers/dashboardController');

router.get('/summary',       authenticate, getSummary);
router.get('/spending-trend', authenticate, getSpendingTrend);
router.get('/category-split', authenticate, getCategorySplit);
router.get('/budget-vs-actual', authenticate, getBudgetVsActual);

module.exports = router;
