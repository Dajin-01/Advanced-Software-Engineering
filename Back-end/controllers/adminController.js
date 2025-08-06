const User = require('../models/User');
const Booking = require('../models/Booking');

// Get all users for admin dashboard
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.user_role !== 'admin') {
      return res.status(403).json({
        code: 403,
        msg: 'Access denied. Admin privileges required.'
      });
    }

    const users = await User.getAll();
    
    res.json({
      code: 200,
      msg: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error'
    });
  }
};

// Get user details by ID
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin
    if (req.user.user_role !== 'admin') {
      return res.status(403).json({
        code: 403,
        msg: 'Access denied. Admin privileges required.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        msg: 'User not found'
      });
    }

    // Remove sensitive information
    const { password_hash, ...userDetails } = user;
    
    res.json({
      code: 200,
      msg: 'User details retrieved successfully',
      data: userDetails
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error'
    });
  }
};

// Get gym usage statistics
const getGymUsageStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.user_role !== 'admin') {
      return res.status(403).json({
        code: 403,
        msg: 'Access denied. Admin privileges required.'
      });
    }

    const { period = 'week' } = req.query; // 'day', 'week', 'month'
    
    // Get all bookings for statistics
    const allBookings = await Booking.getAll();
    
    // Calculate statistics based on period
    const stats = calculateUsageStats(allBookings, period);
    
    res.json({
      code: 200,
      msg: 'Gym usage statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Get gym usage stats error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error'
    });
  }
};

// Helper function to calculate usage statistics
const calculateUsageStats = (bookings, period) => {
  const now = new Date();
  const stats = {
    totalBookings: bookings.length,
    period: period,
    timeSlotStats: {},
    dailyStats: {},
    weeklyStats: {},
    topUsers: [],
    busyPeriods: []
  };

  // Filter bookings based on period
  let filteredBookings = bookings;
  if (period === 'day') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= today;
    });
  } else if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= weekAgo;
    });
  } else if (period === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= monthAgo;
    });
  }

  // Calculate time slot statistics
  const timeSlotCounts = {};
  filteredBookings.forEach(booking => {
    let timeSlot = 'Unknown';
    if (booking.booking_time) {
      const time = new Date(`2000-01-01T${booking.booking_time}`);
      const hour = time.getHours();
      if (hour >= 6 && hour < 12) {
        timeSlot = 'Morning (6AM-12PM)';
      } else if (hour >= 12 && hour < 18) {
        timeSlot = 'Afternoon (12PM-6PM)';
      } else if (hour >= 18 && hour < 22) {
        timeSlot = 'Evening (6PM-10PM)';
      } else {
        timeSlot = 'Night (10PM-6AM)';
      }
    }
    timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
  });
  stats.timeSlotStats = timeSlotCounts;

  // Calculate daily statistics
  const dailyCounts = {};
  filteredBookings.forEach(booking => {
    const date = new Date(booking.booking_date).toDateString();
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  });
  stats.dailyStats = dailyCounts;

  // Calculate weekly statistics
  const weeklyCounts = {};
  filteredBookings.forEach(booking => {
    const date = new Date(booking.booking_date);
    const weekStart = new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000);
    const weekKey = weekStart.toDateString();
    weeklyCounts[weekKey] = (weeklyCounts[weekKey] || 0) + 1;
  });
  stats.weeklyStats = weeklyCounts;

  // Calculate top users
  const userCounts = {};
  filteredBookings.forEach(booking => {
    const userId = booking.user_id;
    userCounts[userId] = (userCounts[userId] || 0) + 1;
  });
  
  const topUsers = Object.entries(userCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([userId, count]) => ({ userId, count }));
  stats.topUsers = topUsers;

  // Calculate busy periods (time slots with most bookings)
  const busyPeriods = Object.entries(timeSlotCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([timeSlot, count]) => ({ timeSlot, count }));
  stats.busyPeriods = busyPeriods;

  return stats;
};

module.exports = {
  getAllUsers,
  getUserDetails,
  getGymUsageStats
}; 