import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi';
import { HiOutlineCheckBadge } from 'react-icons/hi2';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings
    .filter((b) => b.date >= today && b.status === 'confirmed')
    .sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot))
    .slice(0, 5);

  const totalBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const todayBookings = bookings.filter(
    (b) => b.date === today && b.status === 'confirmed'
  ).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === today) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-primary-400 text-sm font-medium mb-1">{getGreeting()}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-surface-400 mt-2">
            Here&apos;s your lab booking overview
          </p>
        </div>
        <Link
          to="/book"
          id="quick-book-btn"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold text-sm hover-lift transition-all duration-300 shadow-lg shadow-primary-500/20"
        >
          <HiOutlineCalendar className="w-5 h-5" />
          Book a Slot
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Bookings',
            value: totalBookings,
            icon: HiOutlineCheckBadge,
            color: 'primary',
            gradient: 'from-primary-500/15 to-primary-600/5',
            iconBg: 'bg-primary-500/15',
            iconColor: 'text-primary-400',
          },
          {
            label: "Today's Sessions",
            value: todayBookings,
            icon: HiOutlineClock,
            color: 'accent',
            gradient: 'from-accent-500/15 to-accent-600/5',
            iconBg: 'bg-accent-500/15',
            iconColor: 'text-accent-400',
          },
          {
            label: 'Upcoming',
            value: upcomingBookings.length,
            icon: HiOutlineSparkles,
            color: 'warning',
            gradient: 'from-warning-400/15 to-warning-500/5',
            iconBg: 'bg-warning-400/15',
            iconColor: 'text-warning-400',
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`glass rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} animate-slide-up`}
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-surface-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-extrabold text-white mt-2">
                  {loading ? (
                    <span className="skeleton inline-block w-12 h-9" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-800/50">
          <div>
            <h2 className="text-lg font-bold text-white">Upcoming Bookings</h2>
            <p className="text-surface-500 text-sm mt-0.5">Your next lab sessions</p>
          </div>
          <Link
            to="/my-bookings"
            className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors flex items-center gap-1"
          >
            View All
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-surface-800/50 flex items-center justify-center mx-auto mb-4">
                <HiOutlineCalendar className="w-8 h-8 text-surface-600" />
              </div>
              <h3 className="text-white font-semibold mb-2">No Upcoming Bookings</h3>
              <p className="text-surface-500 text-sm mb-6">
                Book your first lab session to get started
              </p>
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium hover-lift transition-all duration-300"
              >
                <HiOutlineCalendar className="w-4 h-4" />
                Book Now
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingBookings.map((booking, i) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30 hover:bg-surface-800/50 transition-all duration-200 group animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                      <HiOutlineClock className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {booking.timeSlot}
                      </p>
                      <p className="text-surface-500 text-xs mt-0.5">
                        {formatDate(booking.date)}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
