const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// Register new user
const register = async (req, res) => {
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
      membershipFee = 0,
      paymentType = 'none'
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        msg: 'User with this email already exists'
      });
    }

    // Create new user
    const userId = await User.create({
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
    });

    // Generate JWT token
    const token = generateToken({
      userId,
      email,
      userRole
    });

    res.status(201).json({
      code: 200,
      msg: 'User registered successfully',
      data: {
        userId,
        email,
        userRole,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        code: 401,
        msg: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        code: 401,
        msg: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        msg: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userRole: user.user_role
    });

    res.json({
      code: 200,
      msg: 'Login successful',
      data: {
        userId: user.id,
        email: user.email,
        userRole: user.user_role,
        fullName: user.full_name,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error during login'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    // Remove sensitive information
    const { password_hash, ...userProfile } = user;
    
    res.json({
      code: 200,
      msg: 'Profile retrieved successfully',
      data: userProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.password_hash;
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    const success = await User.update(userId, updateData);
    
    if (success) {
      res.json({
        code: 200,
        msg: 'Profile updated successfully'
      });
    } else {
      res.status(400).json({
        code: 400,
        msg: 'Failed to update profile'
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isCurrentPasswordValid = await User.verifyPassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        code: 400,
        msg: 'Current password is incorrect'
      });
    }

    // Update password
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    const success = await User.update(user.id, { password_hash: newPasswordHash });
    
    if (success) {
      res.json({
        code: 200,
        msg: 'Password changed successfully'
      });
    } else {
      res.status(400).json({
        code: 400,
        msg: 'Failed to change password'
      });
    }
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error'
    });
  }
};

// Update payment information
const updatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { membershipFee, paymentType, term } = req.body;

    // Validate required fields
    if (!membershipFee || !paymentType) {
      return res.status(400).json({
        code: 400,
        msg: 'Membership fee and payment type are required'
      });
    }

    // Update user payment information
    const updateData = {
      membership_fee: membershipFee,
      payment_type: paymentType
    };

    const success = await User.update(userId, updateData);
    
    if (success) {
      res.json({
        code: 200,
        msg: 'Payment information updated successfully'
      });
    } else {
      res.status(400).json({
        code: 400,
        msg: 'Failed to update payment information'
      });
    }
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  updatePayment
}; 