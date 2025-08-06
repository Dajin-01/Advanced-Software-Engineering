const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Registration endpoint
router.post('/registration/createMembership', registerValidation, handleValidationErrors, authController.register);

// Login endpoint
router.post('/login', loginValidation, handleValidationErrors, authController.login);

// Get user profile (protected route)
router.get('/profile', authenticateToken, authController.getProfile);

// Update user profile (protected route)
router.put('/profile', authenticateToken, authController.updateProfile);

// Change password (protected route)
router.put('/change-password', authenticateToken, authController.changePassword);

// Update payment information (protected route)
router.put('/users/updatePayment', authenticateToken, authController.updatePayment);

module.exports = router; 