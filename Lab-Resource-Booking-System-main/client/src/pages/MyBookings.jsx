import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming' | 'past' | 'all'

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancellingId(id);
    try {
      await bookingsAPI.cancelBooking(id);
      toast.success('Booking cancelled');
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancellingId(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings
    .filter((b) => {
      if (filter === 'upcoming') return b.date >= today && b.status === 'confirmed';
      if (filter === 'past') return b.date < today;
      return true;
    })
    .sort((a, b) => {
      if (filter === 'past') return b.date.localeCompare(a.date);
      return a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot);
    });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRelativeDate = (dateStr) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === today) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    return null;
  };

  const filters = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Bookings</h1>
          <p className="text-surface-400 mt-2">
            Manage your lab session bookings
          </p>
        </div>
        <div className="flex items-center gap-3 p-1 rounded-xl bg-surface-800/50 border border-surface-700/30">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                filter === f.key
                  ? 'bg-primary-500/15 text-primary-400'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-16 h-16 rounded-2xl bg-surface-800/50 flex items-center justify-center mx-auto mb-4">
              <HiOutlineCalendar className="w-8 h-8 text-surface-600" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No {filter === 'all' ? '' : filter} bookings
            </h3>
            <p className="text-surface-500 text-sm max-w-sm mx-auto">
              {filter === 'upcoming'
                ? "You don't have any upcoming lab sessions. Book one now!"
                : filter === 'past'
                ? "You don't have any past bookings yet."
                : 'No bookings to display.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-800/30">
            {filteredBookings.map((booking, i) => {
              const isPast = booking.date < today;
              const relativeDate = getRelativeDate(booking.date);
              return (
                <div
                  key={booking._id}
                  className={`flex items-center justify-between p-5 hover:bg-surface-800/20 transition-all duration-200 animate-slide-up ${
                    isPast ? 'opacity-60' : ''
                  }`}
                  style={{
                    animationDelay: `${i * 60}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Date Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center shrink-0 ${
                        isPast
                          ? 'bg-surface-800/30 border-surface-700/30'
                          : relativeDate === 'Today'
                          ? 'bg-primary-500/10 border-primary-500/25'
                          : 'bg-surface-800/40 border-surface-700/30'
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          isPast ? 'text-surface-600' : 'text-surface-400'
                        }`}
                      >
                        {new Date(booking.date + 'T00:00:00').toLocaleDateString(
                          'en-US',
                          { month: 'short' }
                        )}
                      </span>
                      <span
                        className={`text-lg font-bold -mt-0.5 ${
                          isPast
                            ? 'text-surface-500'
                            : relativeDate === 'Today'
                            ? 'text-primary-400'
                            : 'text-white'
                        }`}
                      >
                        {new Date(booking.date + 'T00:00:00').getDate()}
                      </span>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white text-sm">
                          {formatDate(booking.date)}
                        </p>
                        {relativeDate && (
                          <span className="px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-400 text-xs font-medium">
                            {relativeDate}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <HiOutlineClock className="w-3.5 h-3.5 text-surface-500" />
                        <span className="text-surface-400 text-sm">
                          {booking.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        isPast
                          ? 'bg-surface-700/30 text-surface-500'
                          : 'bg-accent-500/10 text-accent-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPast ? 'bg-surface-500' : 'bg-accent-500'
                        }`}
                      />
                      {isPast ? 'Completed' : 'Confirmed'}
                    </span>

                    {!isPast && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="p-2 rounded-xl text-surface-500 hover:text-danger-400 hover:bg-danger-500/10 transition-all duration-200 disabled:opacity-50"
                        title="Cancel booking"
                      >
                        {cancellingId === booking._id ? (
                          <div className="w-4 h-4 border-2 border-danger-400/30 border-t-danger-400 rounded-full animate-spin" />
                        ) : (
                          <HiOutlineTrash className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && bookings.length > 0 && (
        <div className="glass rounded-2xl p-5 flex items-center gap-3">
          <HiOutlineExclamationCircle className="w-5 h-5 text-surface-500 shrink-0" />
          <p className="text-surface-500 text-sm">
            Showing {filteredBookings.length} of {bookings.length} total bookings.
            You can cancel upcoming bookings at any time.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
