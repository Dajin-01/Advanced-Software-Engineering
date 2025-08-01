// Payment form handling
function handlePaymentSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  // Get selected values
  const term = formData.get('term');
  const fee = formData.get('fee');
  const paymentType = formData.get('paymentType');
  
  // Validate form
  if (!term || !fee || !paymentType) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Get user info from localStorage
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');
  
  if (!userId || !authToken) {
    alert('User session not found. Please register again.');
    window.location.href = '../register/user-type.html';
    return;
  }
  
  // Prepare payment data
  const paymentData = {
    userId: userId,
    membershipFee: parseFloat(fee),
    paymentType: paymentType,
    term: parseInt(term)
  };
  
  console.log('Sending payment data:', paymentData);
  
  // Update user payment information
  fetch('http://localhost:8081/api/users/updatePayment', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(paymentData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    if (result.code === 200) {
      alert('Registration Complete!');
      window.location.href = '../login/login.html';
    } else {
      alert('Payment update failed: ' + result.msg);
    }
  })
  .catch(error => {
    console.error('Payment update error:', error);
    alert('Payment update failed. Please try again.');
  });
}

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.payment-form');
  if (form) {
    form.onsubmit = handlePaymentSubmit;
  }
  
  // Auto-select fee based on term selection
  const termRadios = document.querySelectorAll('input[name="term"]');
  const feeRadios = document.querySelectorAll('input[name="fee"]');
  
  termRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // Clear fee selection
      feeRadios.forEach(feeRadio => feeRadio.checked = false);
      
      // Auto-select corresponding fee
      if (this.value === '1') {
        document.querySelector('input[name="fee"][value="50"]').checked = true;
      } else if (this.value === '3') {
        document.querySelector('input[name="fee"][value="100"]').checked = true;
      }
    });
  });
  
  feeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // Auto-select corresponding term
      if (this.value === '50') {
        document.querySelector('input[name="term"][value="1"]').checked = true;
      } else if (this.value === '100') {
        document.querySelector('input[name="term"][value="3"]').checked = true;
      }
    });
  });
}); 