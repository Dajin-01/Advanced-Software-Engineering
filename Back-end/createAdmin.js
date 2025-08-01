const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function createAdminAccount() {
  try {
    const connection = await pool.getConnection();
    
    // Check if admin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@gym.com']
    );
    
    if (existingAdmin.length > 0) {
      console.log('❌ Admin account already exists');
      connection.release();
      return;
    }
    
    // Hash password
    const saltRounds = 12;
    const password = 'admin123'; // 기본 비밀번호
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create admin account
    const adminData = {
      user_role: 'admin',
      full_name: 'Gym Administrator',
      email: 'admin@gym.com',
      password_hash: passwordHash,
      mobile_number: '+65 9123 4567',
      gender: 'Other',
      birthdate: '1990-01-01',
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_number: '+65 9123 4568',
      terms_accepted: true,
      membership_fee: 0.00,
      payment_type: 'none',
      is_active: true
    };
    
    const query = `
      INSERT INTO users (
        user_role, full_name, email, password_hash, mobile_number,
        gender, birthdate, emergency_contact_name, emergency_contact_number,
        terms_accepted, membership_fee, payment_type, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      adminData.user_role,
      adminData.full_name,
      adminData.email,
      adminData.password_hash,
      adminData.mobile_number,
      adminData.gender,
      adminData.birthdate,
      adminData.emergency_contact_name,
      adminData.emergency_contact_number,
      adminData.terms_accepted,
      adminData.membership_fee,
      adminData.payment_type,
      adminData.is_active
    ];
    
    const [result] = await connection.execute(query, values);
    
    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin@gym.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login');
    
    connection.release();
  } catch (error) {
    console.error('❌ Failed to create admin account:', error.message);
  }
}

// Run the script
createAdminAccount().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 