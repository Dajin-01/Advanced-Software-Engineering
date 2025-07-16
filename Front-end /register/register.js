// Registration Form Validation JavaScript

// Validation patterns
const patterns = {
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^.{6,}$/, // Minimum 6 characters, any type
  mobile: /^[\+]?[1-9][\d]{0,15}$/,
};

// Error messages
const errorMessages = {
  name: 'Name must be 2-50 characters long and contain only letters and spaces',
  email: 'Please enter a valid email address',
  password: 'Password must be at least 6 characters long',
  confirmPassword: 'Passwords do not match',
  mobile: 'Please enter a valid mobile number',
  required: 'This field is required',
  age: 'You must be at least 16 years old to register'
};

// Form validation function
function validateForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const formId = form.id;
  const isStudent = formId === 'studentForm';
  
  // Clear all previous errors
  clearAllErrors();
  
  // Get form data
  const formData = {
    name: form.querySelector('#name').value.trim(),
    email: form.querySelector('#email').value.trim(),
    password: form.querySelector('#password').value,
    confirmPassword: form.querySelector('#confirmPassword').value,
    mobile: form.querySelector('#mobile').value.trim(),
    gender: form.querySelector('#gender').value,
    dob: form.querySelector('#dob').value,
    emergencyName: form.querySelector('#emergencyName').value.trim(),
    emergencyNumber: form.querySelector('#emergencyNumber').value.trim()
  };
  
  
  let isValid = true;
  
  // Validate each field
  isValid = validateField('name', formData.name, patterns.name, errorMessages.name) && isValid;
  isValid = validateField('email', formData.email, patterns.email, errorMessages.email) && isValid;
  isValid = validateField('password', formData.password, patterns.password, errorMessages.password) && isValid;
  isValid = validatePasswordMatch(formData.password, formData.confirmPassword) && isValid;
  isValid = validateField('mobile', formData.mobile, patterns.mobile, errorMessages.mobile) && isValid;
  isValid = validateField('gender', formData.gender, null, 'Please select your gender') && isValid;
  isValid = validateDateOfBirth(formData.dob) && isValid;
  isValid = validateField('emergencyName', formData.emergencyName, patterns.name, errorMessages.name) && isValid;
  isValid = validateField('emergencyNumber', formData.emergencyNumber, patterns.mobile, errorMessages.mobile) && isValid;
  
 
  if (isValid) {
    // Store form data (in a real app, this would be sent to server)
    console.log('Form data:', formData);
    
    // Show success message
    showSuccessMessage('Registration form submitted successfully!');
    
    // Redirect to terms page after a short delay
    setTimeout(() => {
      window.location.href = '../terms/terms.html';
    }, 1500);
  }
}

// Validate individual field
function validateField(fieldName, value, pattern, errorMessage) {
  const field = document.getElementById(fieldName);
  const errorElement = document.getElementById(fieldName + 'Error');
  
  // Check if field is empty
  if (!value) {
    showError(field, errorElement, errorMessages.required);
    return false;
  }
  
  // Check pattern if provided
  if (pattern && !pattern.test(value)) {
    showError(field, errorElement, errorMessage);
    return false;
  }
  
  // Show success state
  showSuccess(field, errorElement);
  return true;
}

// Validate password match
function validatePasswordMatch(password, confirmPassword) {
  const confirmField = document.getElementById('confirmPassword');
  const errorElement = document.getElementById('confirmPasswordError');
  
  if (password !== confirmPassword) {
    showError(confirmField, errorElement, errorMessages.confirmPassword);
    return false;
  }
  
  showSuccess(confirmField, errorElement);
  return true;
}

// Validate date of birth
function validateDateOfBirth(dob) {
  const field = document.getElementById('dob');
  const errorElement = document.getElementById('dobError');
  
  if (!dob) {
    showError(field, errorElement, errorMessages.required);
    return false;
  }
  
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 16) {
    showError(field, errorElement, errorMessages.age);
    return false;
  }
  
  showSuccess(field, errorElement);
  return true;
}

// Show error state
function showError(field, errorElement, message) {
  field.classList.remove('success');
  field.classList.add('error');
  errorElement.textContent = message;
  errorElement.style.color = '#dc3545';
}

// Show success state
function showSuccess(field, errorElement) {
  field.classList.remove('error');
  field.classList.add('success');
  errorElement.textContent = '✓ Valid';
  errorElement.style.color = '#28a745';
  errorElement.classList.add('success');
}

// Clear all errors
function clearAllErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  const fields = document.querySelectorAll('input, select');
  
  errorElements.forEach(element => {
    element.textContent = '';
    element.classList.remove('success');
  });
  
  fields.forEach(field => {
    field.classList.remove('error', 'success');
  });
}

// Show success message
function showSuccessMessage(message) {
  // Create success message element
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  successDiv.textContent = message;
  
  document.body.appendChild(successDiv);
  
  // Remove after 3 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Simple password strength checker (optional)
function checkPasswordStrength(password) {
  const passwordField = document.getElementById('password');
  const strengthElement = document.getElementById('passwordStrength');
  
  if (!strengthElement) {
    // Create strength indicator if it doesn't exist
    const strengthDiv = document.createElement('div');
    strengthDiv.id = 'passwordStrength';
    strengthDiv.className = 'password-strength';
    passwordField.parentNode.insertBefore(strengthDiv, passwordField.nextSibling);
  }
  
  let feedback = '';
  
  if (password.length < 6) {
    feedback = 'Password too short (minimum 6 characters)';
    strengthElement.className = 'password-strength weak';
  } else if (password.length >= 6) {
    feedback = 'Password is good';
    strengthElement.className = 'password-strength strong';
  }
  
  strengthElement.textContent = feedback;
}

// Real-time password confirmation check
function checkPasswordMatch() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const confirmField = document.getElementById('confirmPassword');
  const matchElement = document.getElementById('passwordMatch');
  
  if (!matchElement) {
    // Create match indicator if it doesn't exist
    const matchDiv = document.createElement('div');
    matchDiv.id = 'passwordMatch';
    matchDiv.className = 'password-match';
    confirmField.parentNode.insertBefore(matchDiv, confirmField.nextSibling);
  }
  
  if (confirmPassword === '') {
    matchElement.textContent = '';
    matchElement.className = 'password-match';
  } else if (password === confirmPassword) {
    matchElement.textContent = '✓ Passwords match';
    matchElement.className = 'password-match match';
  } else {
    matchElement.textContent = '✗ Passwords do not match';
    matchElement.className = 'password-match no-match';
  }
}

// Initialize form event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Password strength checker
  const passwordField = document.getElementById('password');
  if (passwordField) {
    passwordField.addEventListener('input', function() {
      checkPasswordStrength(this.value);
    });
  }
  
  // Password match checker
  const confirmPasswordField = document.getElementById('confirmPassword');
  if (confirmPasswordField) {
    confirmPasswordField.addEventListener('input', checkPasswordMatch);
  }
  
  // Real-time validation for other fields
  const fields = document.querySelectorAll('input, select');
  fields.forEach(field => {
    field.addEventListener('blur', function() {
      const fieldName = this.id;
      const value = this.value.trim();
      
      // Skip validation for password fields (handled separately)
      if (fieldName === 'password' || fieldName === 'confirmPassword') return;
      
      // Validate based on field type
      switch (fieldName) {
        case 'name':
        case 'emergencyName':
          validateField(fieldName, value, patterns.name, errorMessages.name);
          break;
        case 'email':
          validateField(fieldName, value, patterns.email, errorMessages.email);
          break;
        case 'mobile':
        case 'emergencyNumber':
          validateField(fieldName, value, patterns.mobile, errorMessages.mobile);
          break;

        case 'gender':
          validateField(fieldName, value, null, 'Please select your gender');
          break;
        case 'dob':
          validateDateOfBirth(value);
          break;
      }
    });
  });
});

// Add CSS animation for success message
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style); 