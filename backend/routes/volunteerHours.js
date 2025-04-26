const express = require('express');
const {
  getHours,
  getHour,
  createHour,
  updateHour,
  deleteHour
} = require('../controllers/volunteerHours');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getHours)
  .post(protect, authorize('volunteer'), createHour);

router
  .route('/:id')
  .get(protect, getHour)
  .put(protect, updateHour)
  .delete(protect, authorize('volunteer', 'admin'), deleteHour);

module.exports = router; 