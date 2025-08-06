const Booking = require('../models/Booking');

exports.getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.getAllByUser(userId);
    res.json({ code: 200, bookings });
  } catch (error) {
    res.status(500).json({ code: 500, msg: 'Failed to fetch bookings', error: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { booking_date, booking_time, booked_on, booked_by, reference } = req.body;
    const booking = { user_id: userId, booking_date, booking_time, booked_on, booked_by, reference };
    const bookingId = await Booking.create(booking);
    res.status(201).json({ code: 201, bookingId });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ code: 500, msg: 'Failed to create booking', error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const deleted = await Booking.deleteById(bookingId, userId);
    if (deleted) {
      res.json({ code: 200, msg: 'Booking deleted' });
    } else {
      res.status(404).json({ code: 404, msg: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ code: 500, msg: 'Failed to delete booking', error: error.message });
  }
};