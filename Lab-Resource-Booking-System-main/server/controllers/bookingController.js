const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');

// All available time slots
const TIME_SLOTS = [
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];

// @desc    Get available slots for a specific date
// @route   GET /api/bookings/slots/:date
// @access  Private
const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.params;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }

    // Find all bookings for the given date
    const bookedSlots = await Booking.find({
      date,
      status: 'confirmed',
    }).select('timeSlot user');

    // Build the slots response
    const slots = TIME_SLOTS.map((slot) => {
      const booking = bookedSlots.find((b) => b.timeSlot === slot);
      return {
        timeSlot: slot,
        isBooked: !!booking,
        isOwnBooking: booking
          ? booking.user.toString() === req.user._id.toString()
          : false,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        date,
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join('. '),
      });
    }

    const { date, timeSlot } = req.body;

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({
      date,
      timeSlot,
      status: 'confirmed',
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked! Cplease choose another slot.',
      });
    }

    // Create booking (auto-confirmed)
    const booking = await Booking.create({
      user: req.user._id,
      date,
      timeSlot,
      status: 'confirmed',
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      'user',
      'name email'
    );

    res.status(201).json({
      success: true,
      message: 'Lab booked successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    // Handle duplicate key error (race condition safety net)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This time slot was just booked by someone else. Please try another slot!',
      });
    }
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ date: -1, timeSlot: 1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ensure user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all time slots (reference)
// @route   GET /api/bookings/timeslots
// @access  Public
const getTimeSlots = (req, res) => {
  res.status(200).json({
    success: true,
    data: TIME_SLOTS,
  });
};

module.exports = {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
  getTimeSlots,
};
