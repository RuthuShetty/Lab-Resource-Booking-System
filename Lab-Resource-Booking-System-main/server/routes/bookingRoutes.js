const express = require('express');
const { body } = require('express-validator');
const {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
  getTimeSlots,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/timeslots', getTimeSlots);

// Protected
router.use(protect);

router.get('/slots/:date', getAvailableSlots);

router.post(
  '/',
  [
    body('date')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Date must be in YYYY-MM-DD format'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
  ],
  createBooking
);

router.get('/my', getMyBookings);

router.delete('/:id', cancelBooking);

module.exports = router;
