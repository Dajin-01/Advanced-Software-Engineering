const { body, validationResult } = require('express-validator');

// Registration validation rules
const registrationValidation = [
  body('userRole')
    .isIn(['student', 'worker'])
    .withMessage('User role must be either student or worker'),
  
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be 2-50 characters long'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('mobileNumber')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid mobile number'),
  
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Please select a valid gender'),
  
  body('birthdate')
    .isISO8601()
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 16) {
        throw new Error('You must be at least 16 years old to register');
      }
      return true;
    })
    .withMessage('Please enter a valid date of birth'),
  
  body('emergencyContactName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Emergency contact name must be 2-50 characters long'),
  
  body('emergencyContactNumber')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid emergency contact number'),
  
  body('termsAccepted')
    .isBoolean()
    .custom((value) => {
      if (!value) {
        throw new Error('You must accept the terms and conditions');
      }
      return true;
    })
    .withMessage('You must accept the terms and conditions'),
  
  body('membershipFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Membership fee must be a positive number'),
  
  body('paymentType')
    .optional()
    .isIn(['monthly', 'yearly', 'none'])
    .withMessage('Payment type must be monthly, yearly, or none')
];

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      msg: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  registrationValidation,
  loginValidation,
  handleValidationErrors
}; 