const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      enum: {
        values: [
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
        ],
        message: 'Invalid time slot',
      },
    },
    status: {
      type: String,
      default: 'confirmed',
      enum: ['confirmed', 'cancelled'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent double booking
bookingSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
