const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getAll, create, update, remove } = require('../controllers/budgetController');
const { validate } = require('./routeHelpers');

router.get('/', authenticate, getAll);

router.post('/', authenticate, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('limit_amount').isFloat({ gt: 0 }).withMessage('Limit must be a positive number'),
  body('period').optional().isIn(['monthly', 'weekly']),
], validate, create);

router.put('/:id', authenticate, [
  param('id').isInt({ min: 1 }),
  body('limit_amount').optional().isFloat({ gt: 0 }),
  body('period').optional().isIn(['monthly', 'weekly']),
], validate, update);

router.delete('/:id', authenticate, [
  param('id').isInt({ min: 1 }),
], validate, remove);

module.exports = router;
