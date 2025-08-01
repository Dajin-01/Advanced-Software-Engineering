const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    try {
      const {
        userRole,
        fullName,
        email,
        password,
        mobileNumber,
        gender,
        birthdate,
        emergencyContactName,
        emergencyContactNumber,
        termsAccepted,
        membershipFee,
        paymentType
      } = userData;

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (
          user_role, full_name, email, password_hash, mobile_number,
          gender, birthdate, emergency_contact_name, emergency_contact_number,
          terms_accepted, membership_fee, payment_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userRole,
        fullName,
        email,
        passwordHash,
        mobileNumber,
        gender,
        birthdate,
        emergencyContactName,
        emergencyContactNumber,
        termsAccepted,
        membershipFee,
        paymentType
      ];

      const [result] = await pool.execute(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (fields.length === 0) return false;

      values.push(id);
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const query = 'SELECT id, user_role, full_name, email, mobile_number, gender, is_active, created_at FROM users';
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 