const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getAll, create, update, remove } = require('../controllers/goalController');
const { validate } = require('./routeHelpers');

router.get('/', authenticate, getAll);

router.post('/', authenticate, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('target').isFloat({ gt: 0 }).withMessage('Target must be a positive number'),
  body('saved').optional().isFloat({ min: 0 }),
  body('description').optional().trim(),
], validate, create);

router.put('/:id', authenticate, [
  param('id').isInt({ min: 1 }),
  body('target').optional().isFloat({ gt: 0 }),
  body('saved').optional().isFloat({ min: 0 }),
], validate, update);

router.delete('/:id', authenticate, [
  param('id').isInt({ min: 1 }),
], validate, remove);

module.exports = router;
