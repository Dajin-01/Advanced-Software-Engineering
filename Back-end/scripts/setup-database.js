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
    
    // Try multiple connection methods
    const connectionMethods = [
      // Method 1: Try with root user (no password)
      {
        host: dbConfig.host,
        user: 'root',
        password: '',
        port: dbConfig.port
      },
      // Method 2: Try with root user (common password)
      {
        host: dbConfig.host,
        user: 'root',
        password: 'root',
        port: dbConfig.port
      },
      // Method 3: Try with root user (password from env)
      {
        host: dbConfig.host,
        user: 'root',
        password: process.env.DB_PASSWORD || '',
        port: dbConfig.port
      },
      // Method 4: Try with config user
      {
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port
      }
    ];

    let connected = false;
    let workingConfig = null;

    // Try each connection method
    for (const config of connectionMethods) {
      try {
        console.log(`🔍 Trying to connect with user: ${config.user}...`);
        connection = await mysql.createConnection(config);
        console.log(`✅ Connected successfully with user: ${config.user}`);
        workingConfig = config;
        connected = true;
        break;
      } catch (error) {
        console.log(`❌ Failed to connect with user: ${config.user} - ${error.message}`);
        continue;
      }
    }

    if (!connected) {
      console.log('❌ Could not connect to MySQL with any method.');
      console.log('💡 Trying alternative database setup...');
      await setupSQLite();
      return;
    }

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'jcu_gym_db'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'jcu_gym_db'}' created/verified`);

    // Try to create user with different methods
    const userCreationMethods = [
      // Method 1: Create user with password
      `CREATE USER IF NOT EXISTS '${process.env.DB_USER || 'jcu_user'}'@'localhost' IDENTIFIED BY '${process.env.DB_PASSWORD || 'jcu123'}'`,
      // Method 2: Create user without password
      `CREATE USER IF NOT EXISTS '${process.env.DB_USER || 'jcu_user'}'@'localhost'`,
      // Method 3: Create user with different password
      `CREATE USER IF NOT EXISTS '${process.env.DB_USER || 'jcu_user'}'@'localhost' IDENTIFIED BY 'password'`
    ];

    let userCreated = false;
    for (const method of userCreationMethods) {
      try {
        await connection.execute(method);
        console.log(`✅ User '${process.env.DB_USER || 'jcu_user'}' created/verified`);
        userCreated = true;
        break;
      } catch (error) {
        console.log(`⚠️  User creation method failed: ${error.message}`);
        continue;
      }
    }

    if (!userCreated) {
      console.log('⚠️  Could not create user, proceeding with existing user...');
    }

    // Grant privileges with different methods
    const grantMethods = [
      // Method 1: Grant all privileges
      `GRANT ALL PRIVILEGES ON ${process.env.DB_NAME || 'jcu_gym_db'}.* TO '${process.env.DB_USER || 'jcu_user'}'@'localhost'`,
      // Method 2: Grant specific privileges
      `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON ${process.env.DB_NAME || 'jcu_gym_db'}.* TO '${process.env.DB_USER || 'jcu_user'}'@'localhost'`,
      // Method 3: Grant all privileges to root (fallback)
      `GRANT ALL PRIVILEGES ON ${process.env.DB_NAME || 'jcu_gym_db'}.* TO 'root'@'localhost'`
    ];

    let privilegesGranted = false;
    for (const method of grantMethods) {
      try {
        await connection.execute(method);
        console.log('✅ Privileges granted');
        privilegesGranted = true;
        break;
      } catch (error) {
        console.log(`⚠️  Privilege grant method failed: ${error.message}`);
        continue;
      }
    }

    if (!privilegesGranted) {
      console.log('⚠️  Could not grant privileges, proceeding anyway...');
    }

    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges flushed');

    // Close connection and try to connect with the application user
    await connection.end();

    // Try to connect with the application user
    const appConnectionConfigs = [
      {
        host: dbConfig.host,
        user: process.env.DB_USER || 'jcu_user',
        password: process.env.DB_PASSWORD || 'jcu123',
        database: process.env.DB_NAME || 'jcu_gym_db',
        port: dbConfig.port
      },
      {
        host: dbConfig.host,
        user: process.env.DB_USER || 'jcu_user',
        password: 'password',
        database: process.env.DB_NAME || 'jcu_gym_db',
        port: dbConfig.port
      },
      {
        host: dbConfig.host,
        user: 'root',
        password: '',
        database: process.env.DB_NAME || 'jcu_gym_db',
        port: dbConfig.port
      }
    ];

    let appConnected = false;
    for (const config of appConnectionConfigs) {
      try {
        console.log(`🔍 Testing application connection with user: ${config.user}...`);
        connection = await mysql.createConnection(config);
        console.log(`✅ Application connection successful with user: ${config.user}`);
        appConnected = true;
        
        // Update config.env with working credentials
        updateConfigFile(config);
        break;
      } catch (error) {
        console.log(`❌ Application connection failed with user: ${config.user} - ${error.message}`);
        continue;
      }
    }

    if (!appConnected) {
      console.log('⚠️  Could not connect with application user, but database setup is complete.');
      console.log('💡 You may need to manually configure database credentials in config.env');
    }

    // Create tables
    console.log('📋 Creating database tables...');
    await createBasicTables(connection);
    console.log('✅ Database tables created');

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. The database is ready to use');
    console.log('2. If you had connection issues, check config.env for the correct credentials');
    console.log('3. Run "npm start" to start the server');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MySQL is running:');
    console.log('   - macOS: brew services start mysql');
    console.log('   - Windows: net start mysql');
    console.log('   - Linux: sudo systemctl start mysql');
    console.log('2. Try connecting manually: mysql -u root');
    console.log('3. If MySQL is not installed:');
    console.log('   - macOS: brew install mysql');
    console.log('   - Windows: Download from https://dev.mysql.com/downloads/mysql/');
    console.log('   - Linux: sudo apt-get install mysql-server');
    console.log('4. Reset MySQL root password if needed');
    console.log('5. Alternative: The system will try to use SQLite as fallback');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function setupSQLite() {
  console.log('🗄️  Setting up SQLite as alternative...');
  
  try {
    // Install sqlite3 if not already installed
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    
    try {
      await execAsync('npm install sqlite3 --save');
      console.log('✅ SQLite3 installed');
    } catch (error) {
      console.log('⚠️  SQLite3 installation failed, trying to continue...');
    }

    // Create SQLite database file
    const sqlitePath = path.join(__dirname, '../database/gym.db');
    const sqliteDir = path.dirname(sqlitePath);
    
    if (!fs.existsSync(sqliteDir)) {
      fs.mkdirSync(sqliteDir, { recursive: true });
    }

    // Create basic SQLite tables
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(sqlitePath);

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

    for (const table of tables) {
      db.run(table);
    }

    db.close();
    
    // Update config.env to use SQLite
    updateConfigForSQLite();
    
    console.log('✅ SQLite database setup completed!');
    console.log('💡 The application will now use SQLite instead of MySQL');
    console.log('📁 Database file location: Back-end/database/gym.db');

  } catch (error) {
    console.error('❌ SQLite setup failed:', error.message);
    throw error;
  }
}

function updateConfigForSQLite() {
  try {
    const configPath = path.join(__dirname, '../config.env');
    if (fs.existsSync(configPath)) {
      let configContent = fs.readFileSync(configPath, 'utf8');
      
      // Update to use SQLite
      configContent = configContent.replace(
        /DB_HOST=.*/,
        'DB_HOST=sqlite'
      );
      configContent = configContent.replace(
        /DB_USER=.*/,
        'DB_USER=sqlite'
      );
      configContent = configContent.replace(
        /DB_PASSWORD=.*/,
        'DB_PASSWORD='
      );
      configContent = configContent.replace(
        /DB_NAME=.*/,
        'DB_NAME=database/gym.db'
      );
      
      fs.writeFileSync(configPath, configContent);
      console.log('✅ Updated config.env to use SQLite');
    }
  } catch (error) {
    console.log('⚠️  Could not update config.env:', error.message);
  }
}

function updateConfigFile(workingConfig) {
  try {
    const configPath = path.join(__dirname, '../config.env');
    if (fs.existsSync(configPath)) {
      let configContent = fs.readFileSync(configPath, 'utf8');
      
      // Update database credentials
      configContent = configContent.replace(
        /DB_USER=.*/,
        `DB_USER=${workingConfig.user}`
      );
      configContent = configContent.replace(
        /DB_PASSWORD=.*/,
        `DB_PASSWORD=${workingConfig.password}`
      );
      
      fs.writeFileSync(configPath, configContent);
      console.log('✅ Updated config.env with working credentials');
    }
  } catch (error) {
    console.log('⚠️  Could not update config.env:', error.message);
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
    try {
      await connection.execute(table);
    } catch (error) {
      console.log(`⚠️  Table creation warning: ${error.message}`);
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 