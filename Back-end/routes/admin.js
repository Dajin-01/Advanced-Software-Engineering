const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get user details by ID
router.get('/users/:id', adminController.getUserDetails);

// Get gym usage statistics
router.get('/stats', adminController.getGymUsageStats);

module.exports = router; 