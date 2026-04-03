const express = require('express');
const { body, query, param } = require('express-validator');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getAll, create, update, remove } = require('../controllers/transactionController');
const { validate } = require('./routeHelpers');

router.get('/', authenticate, [
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], validate, getAll);

router.post('/', authenticate, [
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('status').optional().isIn(['paid', 'pending']),
  body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
], validate, create);

router.put('/:id', authenticate, [
  param('id').isInt({ min: 1 }),
  body('amount').optional().isFloat({ gt: 0 }),
  body('type').optional().isIn(['income', 'expense']),
  body('status').optional().isIn(['paid', 'pending']),
  body('date').optional().isISO8601(),
], validate, update);

router.delete('/:id', authenticate, [
  param('id').isInt({ min: 1 }),
], validate, remove);

module.exports = router;
