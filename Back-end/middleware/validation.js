const { body, validationResult } = require('express-validator');

// Validation rules for registration
const registerValidation = [
  body('userRole')
    .isIn(['student', 'worker', 'admin'])
    .withMessage('User role must be student, worker, or admin'),
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('mobileNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid mobile number'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('birthdate')
    .isISO8601()
    .withMessage('Please provide a valid birthdate'),
  body('emergencyContactName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Emergency contact name must be between 2 and 100 characters'),
  body('emergencyContactNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid emergency contact number'),
  body('termsAccepted')
    .isBoolean()
    .withMessage('Terms must be accepted')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  handleValidationErrors
};
