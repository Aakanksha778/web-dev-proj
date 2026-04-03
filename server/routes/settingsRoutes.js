const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getPreferences, updatePreferences } = require('../controllers/settingsController');
const { validate } = require('./routeHelpers');

router.get('/profile', authenticate, getProfile);

router.put('/profile', authenticate, [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('timezone').optional().trim().notEmpty(),
], validate, updateProfile);

router.get('/preferences', authenticate, getPreferences);

router.put('/preferences', authenticate, [
  body('notifications').optional().isBoolean(),
  body('auto_budget').optional().isBoolean(),
  body('dark_mode').optional().isBoolean(),
], validate, updatePreferences);

module.exports = router;
