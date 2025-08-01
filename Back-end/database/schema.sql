-- JCU Gym Management System Database Schema
-- This file contains all the necessary SQL commands to set up the database

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS jcu_gym_db;
USE jcu_gym_db;

-- Create users table
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
);

-- Create sessions table
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
);

-- Create bookings table
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
);

-- Create payments table
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
);

-- Insert default admin user (password: admin123)
INSERT INTO users (
  user_role, 
  full_name, 
  email, 
  password_hash, 
  mobile_number, 
  gender, 
  birthdate, 
  emergency_contact_name, 
  emergency_contact_number, 
  terms_accepted,
  is_active
) VALUES (
  'admin',
  'System Administrator',
  'admin@jcu.edu.au',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Ge',
  '+61412345678',
  'Other',
  '1990-01-01',
  'Emergency Contact',
  '+61412345679',
  TRUE,
  TRUE
) ON DUPLICATE KEY UPDATE id=id;

-- Show tables
SHOW TABLES; 