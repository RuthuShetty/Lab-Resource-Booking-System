import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import BookingSuccessModal from '../components/BookingSuccessModal';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheck,
  HiOutlineLockClosed,
} from 'react-icons/hi';

const BookLab = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  const fetchSlots = async (date) => {
    setLoading(true);
    setSelectedSlots([]);
    try {
      const response = await bookingsAPI.getAvailableSlots(date);
      setSlots(response.data.data.slots);
    } catch (error) {
      toast.error('Failed to load time slots');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSlotTo12Hour = (timeSlot) => {
    if (!timeSlot) return '';
    if (/\b(AM|PM)\b/i.test(timeSlot)) return timeSlot;

    return timeSlot.replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, (_, hour, minute) => {
      const h = Number(hour);
      const normalizedHour = h % 12 === 0 ? 12 : h % 12;
      const suffix = h >= 12 ? 'PM' : 'AM';
      return `${normalizedHour}:${minute} ${suffix}`;
    });
  };

  const handleBooking = async () => {
    if (selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }

    setBooking(true);
    try {
      const bookingResults = [];
      for (const slot of selectedSlots) {
        try {
          const response = await bookingsAPI.createBooking({
            date: selectedDate,
            timeSlot: formatTimeSlotTo12Hour(slot),
          });
          bookingResults.push({ slot, success: true, data: response.data.data });
        } catch (error) {
          bookingResults.push({
            slot,
            success: false,
            message: error.response?.data?.message || 'Failed to book slot',
          });
        }
      }

      const successfulBookings = bookingResults.filter((r) => r.success);
      if (successfulBookings.length > 0) {
        setSuccessBooking(successfulBookings[0].data);
      }

      const failedBookings = bookingResults.filter((r) => !r.success);
      if (failedBookings.length > 0) {
        toast.error(
          `${failedBookings.length} slot(s) could not be booked. ${failedBookings[0].message}`
        );
      } else {
        toast.success(`Booked ${successfulBookings.length} slot(s)`);
      }

      setSelectedSlots([]);
      fetchSlots(selectedDate);
    } finally {
      setBooking(false);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const { firstDay, daysInMonth, year, month } = getDaysInMonth(currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const handleDateClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    if (dateStr >= today) {
      setSelectedDate(dateStr);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedDate;
  };

  const isPast = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Book Lab Session</h1>
        <p className="text-surface-400 mt-2">
          Select a date and time slot to book your lab
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar - Left */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl overflow-hidden">
            {/* Month Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800/50">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all duration-200"
              >
                <HiOutlineChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-white font-bold">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all duration-200"
              >
                <HiOutlineChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-0 px-4 pt-4">
              {dayNames.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-surface-500 pb-3"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1 px-4 pb-4">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const past = isPast(day);
                return (
                  <button
                    key={day}
                    onClick={() => !past && handleDateClick(day)}
                    disabled={past}
                    className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                      isSelected(day)
                        ? 'gradient-primary text-white shadow-lg shadow-primary-500/25'
                        : isToday(day)
                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30'
                        : past
                        ? 'text-surface-700 cursor-not-allowed'
                        : 'text-surface-300 hover:bg-surface-800/50 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Display */}
          <div className="glass rounded-2xl p-5 mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <HiOutlineCalendar className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-surface-500 text-xs font-medium">Selected Date</p>
                <p className="text-white font-semibold text-sm">{formatSelectedDate()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots - Right */}
        <div className="lg:col-span-3">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-surface-800/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineClock className="w-5 h-5 text-primary-400" />
                Available Time Slots
              </h3>
              <p className="text-surface-500 text-sm mt-1">
                Select one or more available slots and confirm your booking
              </p>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="skeleton h-16 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map((slot, i) => {
                    const isSelected = selectedSlots.includes(slot.timeSlot);
                    return (
                      <button
                        key={slot.timeSlot}
                        onClick={() => {
                          if (slot.isBooked) return;
                          setSelectedSlots((prev) =>
                            prev.includes(slot.timeSlot)
                              ? prev.filter((s) => s !== slot.timeSlot)
                              : [...prev, slot.timeSlot]
                          );
                        }}
                        disabled={slot.isBooked}
                        className={`relative p-4 rounded-xl border text-left transition-all duration-300 group animate-slide-up ${
                          slot.isBooked
                            ? slot.isOwnBooking
                              ? 'bg-accent-500/5 border-accent-500/20 cursor-not-allowed'
                              : 'bg-surface-800/20 border-surface-800/30 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-primary-500/10 border-primary-500/40 shadow-lg shadow-primary-500/10'
                            : 'bg-surface-800/20 border-surface-700/30 hover:bg-surface-800/40 hover:border-surface-600/40'
                        }`}
                        style={{
                          animationDelay: `${i * 50}ms`,
                          animationFillMode: 'both',
                        }}
                      >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              slot.isBooked
                                ? slot.isOwnBooking
                                  ? 'bg-accent-500/15'
                                  : 'bg-surface-700/50'
                                : isSelected
                                ? 'bg-primary-500/20'
                                : 'bg-surface-700/30 group-hover:bg-surface-700/50'
                            }`}
                          >
                            {slot.isBooked ? (
                              slot.isOwnBooking ? (
                                <HiOutlineCheck className="w-5 h-5 text-accent-400" />
                              ) : (
                                <HiOutlineLockClosed className="w-4 h-4 text-surface-500" />
                              )
                            ) : isSelected ? (
                              <HiOutlineCheck className="w-5 h-5 text-primary-400" />
                            ) : (
                              <HiOutlineClock className="w-4 h-4 text-surface-400 group-hover:text-surface-300" />
                            )}
                          </div>
                          <div>
                            <p
                              className={`font-semibold text-sm ${
                                slot.isBooked
                                  ? slot.isOwnBooking
                                    ? 'text-accent-400'
                                    : 'text-surface-600'
                                  : isSelected
                                  ? 'text-primary-300'
                                  : 'text-surface-200 group-hover:text-white'
                              }`}
                            >
                              {formatTimeSlotTo12Hour(slot.timeSlot)}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${
                                slot.isBooked
                                  ? slot.isOwnBooking
                                    ? 'text-accent-500/70'
                                    : 'text-surface-600'
                                  : 'text-surface-500'
                              }`}
                            >
                              {slot.isBooked
                                ? slot.isOwnBooking
                                  ? 'Your booking'
                                  : 'Already booked'
                                : isSelected
                                ? 'Selected'
                                : 'Available'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                </div>
              )}

              {/* Book Button */}
              {selectedSlots.length > 0 && (
                <div className="mt-6 animate-slide-up">
                  <button
                    id="confirm-booking-btn"
                    onClick={handleBooking}
                    disabled={booking}
                    className="w-full py-4 px-6 rounded-xl gradient-primary text-white font-semibold hover-lift transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm shadow-lg shadow-primary-500/20"
                  >
                    {booking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <HiOutlineCalendar className="w-5 h-5" />
                        Confirm Booking — {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <BookingSuccessModal
        booking={successBooking}
        onClose={() => setSuccessBooking(null)}
      />
    </div>
  );
};

export default BookLab;
