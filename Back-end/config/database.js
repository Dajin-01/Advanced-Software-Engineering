const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: './config.env' });

let pool = null;
let sqliteDb = null;

// Check if using SQLite
const isUsingSQLite = () => {
  return process.env.DB_HOST === 'sqlite' || process.env.DB_NAME?.includes('.db');
};

// Initialize SQLite
const initializeSQLite = () => {
  if (sqliteDb) return sqliteDb;
  
  const dbPath = process.env.DB_NAME || path.join(__dirname, '../database/gym.db');
  sqliteDb = new sqlite3.Database(dbPath);
  return sqliteDb;
};

// Initialize MySQL
const initializeMySQL = () => {
  if (pool) return pool;
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jcu_gym_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  
  pool = mysql.createPool(dbConfig);
  return pool;
};

// Test database connection
const testConnection = async () => {
  try {
    if (isUsingSQLite()) {
      const db = initializeSQLite();
      return new Promise((resolve, reject) => {
        db.get('SELECT 1', (err, row) => {
          if (err) {
            console.error('❌ SQLite connection failed:', err.message);
            reject(err);
          } else {
            console.log('✅ SQLite connected successfully');
            resolve();
          }
        });
      });
    } else {
      const connection = await initializeMySQL().getConnection();
      console.log('✅ MySQL connected successfully');
      connection.release();
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    if (isUsingSQLite()) {
      const db = initializeSQLite();
      await createSQLiteTables(db);
    } else {
      const connection = await initializeMySQL().getConnection();
      await createMySQLTables(connection);
      connection.release();
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Create MySQL tables
const createMySQLTables = async (connection) => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS sessions (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS bookings (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_type ENUM('membership', 'session', 'other') NOT NULL,
      payment_method ENUM('credit_card', 'debit_card', 'cash', 'bank_transfer') NOT NULL,
      status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
      transaction_id VARCHAR(100),
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];
  
  for (const table of tables) {
    await connection.execute(table);
  }
};

// Create SQLite tables
const createSQLiteTables = (db) => {
  return new Promise((resolve, reject) => {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_role TEXT CHECK(user_role IN ('student', 'worker', 'admin')) NOT NULL DEFAULT 'student',
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        mobile_number TEXT NOT NULL,
        gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')) NOT NULL,
        birthdate TEXT NOT NULL,
        emergency_contact_name TEXT NOT NULL,
        emergency_contact_number TEXT NOT NULL,
        terms_accepted INTEGER DEFAULT 0,
        membership_fee REAL DEFAULT 0.00,
        payment_type TEXT DEFAULT 'none',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_date TEXT NOT NULL,
        session_time TEXT NOT NULL,
        session_type TEXT CHECK(session_type IN ('personal_training', 'group_class', 'consultation')) NOT NULL,
        trainer_id INTEGER,
        status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        booking_date TEXT NOT NULL,
        booking_time TEXT NOT NULL,
        equipment_type TEXT,
        duration_minutes INTEGER DEFAULT 60,
        status TEXT CHECK(status IN ('confirmed', 'pending', 'cancelled')) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        payment_type TEXT CHECK(payment_type IN ('membership', 'session', 'other')) NOT NULL,
        payment_method TEXT CHECK(payment_method IN ('credit_card', 'debit_card', 'cash', 'bank_transfer')) NOT NULL,
        status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
        transaction_id TEXT,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    ];
    
    let completed = 0;
    const total = tables.length;
    
    tables.forEach((table, index) => {
      db.run(table, (err) => {
        if (err) {
          console.log(`⚠️  Table creation warning: ${err.message}`);
        }
        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Get database connection
const getConnection = () => {
  if (isUsingSQLite()) {
    return initializeSQLite();
  } else {
    return initializeMySQL();
  }
};

module.exports = {
  testConnection,
  initializeDatabase,
  getConnection,
  isUsingSQLite
}; 