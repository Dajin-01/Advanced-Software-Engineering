const { pool } = require('../config/database');

class Booking {
  static async getAll() {
    const query = 'SELECT * FROM bookings ORDER BY booking_date DESC, booking_time DESC';
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async getAllByUser(userId) {
    const query = 'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC, booking_time DESC';
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  static async create(booking) {
    const { user_id, booking_date, booking_time, booked_on, booked_by, reference } = booking;
    const query = `INSERT INTO bookings (user_id, booking_date, booking_time, booked_on, booked_by, reference)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [user_id, booking_date, booking_time, booked_on, booked_by, reference]);
    return result.insertId;
  }

  static async deleteById(id, userId) {
    const query = 'DELETE FROM bookings WHERE id = ? AND user_id = ?';
    const [result] = await pool.execute(query, [id, userId]);
    return result.affectedRows > 0;
  }
}

module.exports = Booking;