const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execAsync = util.promisify(exec);

async function resetMySQL() {
  console.log('🔄 MySQL Reset Script');
  console.log('=====================');

  try {
    // Detect OS
    const platform = process.platform;
    console.log(`📋 Detected platform: ${platform}`);

    if (platform === 'darwin') {
      // macOS
      await resetMySQLMac();
    } else if (platform === 'win32') {
      // Windows
      await resetMySQLWindows();
    } else {
      // Linux
      await resetMySQLLinux();
    }

    console.log('✅ MySQL reset completed successfully!');
    console.log('💡 You can now run: npm run setup-db');

  } catch (error) {
    console.error('❌ MySQL reset failed:', error.message);
    process.exit(1);
  }
}

async function resetMySQLMac() {
  console.log('🍎 Resetting MySQL on macOS...');

  try {
    // Stop MySQL service
    console.log('🛑 Stopping MySQL service...');
    await execAsync('brew services stop mysql');

    // Remove MySQL data directory
    console.log('🗑️  Removing MySQL data directory...');
    await execAsync('rm -rf /opt/homebrew/var/mysql');

    // Start MySQL service (this will reinitialize)
    console.log('🚀 Starting MySQL service...');
    await execAsync('brew services start mysql');

    // Wait for MySQL to be ready
    console.log('⏳ Waiting for MySQL to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Test connection
    console.log('🔍 Testing MySQL connection...');
    await execAsync('mysql -u root -e "SELECT 1"');

    console.log('✅ MySQL reset successful on macOS');

  } catch (error) {
    console.error('❌ macOS MySQL reset failed:', error.message);
    throw error;
  }
}

async function resetMySQLWindows() {
  console.log('🪟 Resetting MySQL on Windows...');

  try {
    // Stop MySQL service
    console.log('🛑 Stopping MySQL service...');
    await execAsync('net stop mysql');

    // Note: On Windows, we can't easily remove the data directory
    // So we'll just restart the service
    console.log('🚀 Starting MySQL service...');
    await execAsync('net start mysql');

    // Wait for MySQL to be ready
    console.log('⏳ Waiting for MySQL to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('✅ MySQL reset completed on Windows');
    console.log('💡 If you still have issues, consider reinstalling MySQL');

  } catch (error) {
    console.error('❌ Windows MySQL reset failed:', error.message);
    console.log('💡 Try running as Administrator or reinstall MySQL');
    throw error;
  }
}

async function resetMySQLLinux() {
  console.log('🐧 Resetting MySQL on Linux...');

  try {
    // Stop MySQL service
    console.log('🛑 Stopping MySQL service...');
    await execAsync('sudo systemctl stop mysql');

    // Remove MySQL data directory
    console.log('🗑️  Removing MySQL data directory...');
    await execAsync('sudo rm -rf /var/lib/mysql');

    // Start MySQL service
    console.log('🚀 Starting MySQL service...');
    await execAsync('sudo systemctl start mysql');

    // Wait for MySQL to be ready
    console.log('⏳ Waiting for MySQL to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Test connection
    console.log('🔍 Testing MySQL connection...');
    await execAsync('mysql -u root -e "SELECT 1"');

    console.log('✅ MySQL reset successful on Linux');

  } catch (error) {
    console.error('❌ Linux MySQL reset failed:', error.message);
    throw error;
  }
}

// Run reset if this file is executed directly
if (require.main === module) {
  resetMySQL();
}

module.exports = { resetMySQL }; 