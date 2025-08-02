const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Setting up database...');
    
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'jcu_gym_db'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'jcu_gym_db'}' created/verified`);
    
    // Create user if it doesn't exist
    const createUserQuery = `
      CREATE USER IF NOT EXISTS '${process.env.DB_USER || 'jcu_user'}'@'localhost' 
      IDENTIFIED BY '${process.env.DB_PASSWORD || 'jcu123'}'
    `;
    await connection.execute(createUserQuery);
    console.log(`✅ User '${process.env.DB_USER || 'jcu_user'}' created/verified`);
    
    // Grant privileges
    const grantQuery = `
      GRANT ALL PRIVILEGES ON ${process.env.DB_NAME || 'jcu_gym_db'}.* 
      TO '${process.env.DB_USER || 'jcu_user'}'@'localhost'
    `;
    await connection.execute(grantQuery);
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');
    
    // Close connection and reconnect with database
    await connection.end();
    
    // Connect to the specific database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: process.env.DB_USER || 'jcu_user',
      password: process.env.DB_PASSWORD || 'jcu123',
      database: process.env.DB_NAME || 'jcu_gym_db',
      port: dbConfig.port
    });
    
    console.log('✅ Connected to database');
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await connection.execute(schema);
      console.log('✅ Database schema executed');
    } else {
      console.log('⚠️  Schema file not found, creating basic tables...');
      await createBasicTables(connection);
    }
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials in config.env');
    console.log('3. Try running: brew services start mysql (on macOS)');
    console.log('4. For Windows: net start mysql');
    console.log('5. For Linux: sudo systemctl start mysql');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createBasicTables(connection) {
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
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 