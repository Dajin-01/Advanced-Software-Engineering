const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jcu_gym_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    
    // Test if database exists, if not create it
    try {
      await connection.execute(`USE ${process.env.DB_NAME || 'jcu_gym_db'}`);
    } catch (error) {
      console.log('📝 Creating database...');
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'jcu_gym_db'}`);
      await connection.execute(`USE ${process.env.DB_NAME || 'jcu_gym_db'}`);
      console.log('✅ Database created successfully');
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Please check your database configuration in config.env');
    console.error('💡 Make sure MySQL is running and credentials are correct');
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_role ENUM('student', 'worker', 'admin') NOT NULL DEFAULT 'student',
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(20) NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        birthdate DATE NOT NULL,
        emergency_contact_name VARCHAR(100) NOT NULL,
        emergency_contact_number VARCHAR(20) NOT NULL,
        terms_accepted BOOLEAN DEFAULT FALSE,
        membership_fee DECIMAL(10,2) DEFAULT 0.00,
        payment_type VARCHAR(50) DEFAULT 'none',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_date DATE NOT NULL,
        session_time TIME NOT NULL,
        session_type ENUM('personal_training', 'group_class', 'consultation') NOT NULL,
        trainer_id INT,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        equipment_type VARCHAR(100),
        duration_minutes INT DEFAULT 60,
        status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_type ENUM('membership', 'session', 'other') NOT NULL,
        payment_method ENUM('credit_card', 'debit_card', 'cash', 'bank_transfer') NOT NULL,
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        transaction_id VARCHAR(100),
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Insert default admin user if not exists
    const [adminUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@gym.com']
    );

    if (adminUsers.length === 0) {
      const bcrypt = require('bcryptjs');
      const adminPasswordHash = await bcrypt.hash('admin123', 12);
      
      await connection.execute(`
        INSERT INTO users (
          user_role, full_name, email, password_hash, mobile_number,
          gender, birthdate, emergency_contact_name, emergency_contact_number,
          terms_accepted, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'admin',
        'System Administrator',
        'admin@gym.com',
        adminPasswordHash,
        '+61412345678',
        'Other',
        '1990-01-01',
        'Emergency Contact',
        '+61412345679',
        true,
        true
      ]);
      
      console.log('✅ Default admin user created');
    }

    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
}; 