document.addEventListener('DOMContentLoaded', function() {
  const dateOptionsDiv = document.getElementById('date-options');
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  let count = 0;
  let dayOffset = 1;
  while (count < 7) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    if (date.getDay() !== 0) { // Exclude Sundays
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dayName = daysOfWeek[date.getDay()];
      const value = `${yyyy}-${mm}-${dd}`;
      const label = `${yyyy}-${mm}-${dd} (${dayName})`;
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'booking-date';
      radio.value = value;
      if (count === 0) radio.checked = false; // Do not check by default
      const labelElem = document.createElement('label');
      labelElem.className = 'option-label';
      labelElem.appendChild(radio);
      labelElem.appendChild(document.createTextNode(' ' + label));
      dateOptionsDiv.appendChild(labelElem);
      count++;
    }
    dayOffset++;
  }

  // Helper to generate time slots
  function generateTimeSlots(startHour, endHour) {
    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00:00`;
      slots.push(time);
    }
    return slots;
  }

  // Show timing section and populate options
  function showTimingOptions(selectedDate) {
    const timingSection = document.getElementById('timing-section');
    const timingOptionsDiv = document.getElementById('timing-options');
    timingOptionsDiv.innerHTML = '';
    const dateObj = new Date(selectedDate);
    const day = dateObj.getDay();
    let endHour = 21;
    if (day === 6) { // Saturday
      endHour = 18;
    }
    const slots = generateTimeSlots(7, endHour);
    slots.forEach((slot, idx) => {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'booking-time';
      radio.value = slot;
      if (idx === 0) radio.checked = true;
      const labelElem = document.createElement('label');
      labelElem.className = 'option-label';
      labelElem.appendChild(radio);
      labelElem.appendChild(document.createTextNode(' ' + slot));
      timingOptionsDiv.appendChild(labelElem);
    });
    timingSection.style.display = 'block';
  }

  // Add event listeners to date radios after they are created
  function addDateRadioListeners() {
    const radios = document.querySelectorAll('input[name="booking-date"]');
    radios.forEach(radio => {
      radio.addEventListener('change', function() {
        showTimingOptions(this.value);
      });
    });
    // Do not show timing section on page load
    const timingSection = document.getElementById('timing-section');
    timingSection.style.display = 'none';
  }

  // After date radios are created, add listeners
  addDateRadioListeners();

  // Handle form submission
  document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get selected date and time
    const selectedDate = document.querySelector('input[name="booking-date"]:checked');
    const selectedTime = document.querySelector('input[name="booking-time"]:checked');
    
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    // Create booking object
    const booking = {
      reference: generateBookingReference(),
      userName: 'Dajin Kim',
      bookingDate: formatBookingDate(selectedDate.value),
      bookingTime: selectedTime.value,
      bookedOn: new Date().toISOString().replace('T', ' ').substring(0, 19),
      bookedBy: 'Dajin Kim'
    };

    // Store booking in sessionStorage (temporary for demo)
    const existingBookings = JSON.parse(sessionStorage.getItem('bookings') || '[]');
    existingBookings.push(booking);
    sessionStorage.setItem('bookings', JSON.stringify(existingBookings));

    // Redirect to booking page
    window.location.href = 'booking.html';
  });

  // Generate booking reference
  function generateBookingReference() {
    const existingBookings = JSON.parse(sessionStorage.getItem('bookings') || '[]');
    const baseNumber = 3 + existingBookings.length;
    return `JYM202510000${baseNumber}`;
  }

  // Format booking date for display
  function formatBookingDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}); 