import { HiCheckCircle, HiX } from 'react-icons/hi';

const BookingSuccessModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="relative bg-surface-900 border border-surface-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
        >
          <HiX className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-accent-500/15 flex items-center justify-center animate-scale-in">
            <HiCheckCircle className="w-12 h-12 text-accent-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-surface-400 text-center text-sm mb-8">
          Your lab session has been successfully booked
        </p>

        {/* Booking Details */}
        <div className="bg-surface-800/50 rounded-2xl p-5 mb-6 border border-surface-700/30">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-surface-400 text-sm">Date</span>
              <span className="text-white font-semibold">
                {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="h-px bg-surface-700/50" />
            <div className="flex justify-between items-center">
              <span className="text-surface-400 text-sm">Time Slot</span>
              <span className="text-primary-400 font-semibold">{booking.timeSlot}</span>
            </div>
            <div className="h-px bg-surface-700/50" />
            <div className="flex justify-between items-center">
              <span className="text-surface-400 text-sm">Status</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/15 text-accent-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl gradient-primary text-white font-semibold text-sm hover-lift transition-all duration-300"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
