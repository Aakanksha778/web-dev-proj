const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const {
  getMyRequests,
  createRequest,
  getPendingRequests,
  getAllRequests,
  approveRequest,
  denyRequest,
} = require('../controllers/requestController');
const { validate } = require('./routeHelpers');

router.get('/my',      authenticate, getMyRequests);
router.get('/pending', authenticate, requireRole('approver'), getPendingRequests);
router.get('/all',     authenticate, requireRole('approver'), getAllRequests);

router.post('/', authenticate, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
], validate, createRequest);

router.put('/:id/approve', authenticate, requireRole('approver'), [
  param('id').isInt({ min: 1 }),
], validate, approveRequest);

router.put('/:id/deny', authenticate, requireRole('approver'), [
  param('id').isInt({ min: 1 }),
], validate, denyRequest);

module.exports = router;
