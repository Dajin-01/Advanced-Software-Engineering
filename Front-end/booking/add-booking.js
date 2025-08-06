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
  
    // MySQL DATETIME 포맷으로 변환하는 함수
    function getMySQLDatetime() {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }

    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      // Get selected date and time
      const selectedDate = document.querySelector('input[name="booking-date"]:checked');
      const selectedTime = document.querySelector('input[name="booking-time"]:checked');
      if (!selectedDate || !selectedTime) {
        alert('Please select both date and time');
        return;
      }
      // Create booking object for API
      const booking = {
        booking_date: selectedDate.value, // YYYY-MM-DD
        booking_time: selectedTime.value, // HH:MM:SS
        booked_on: getMySQLDatetime(), // ← 여기!
        booked_by: localStorage.getItem('userName') || 'Unknown',
        reference: generateBookingReference()
      };
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(booking)
        });
        const data = await response.json();
        if (data.code === 201) {
          window.location.href = 'booking.html';
        } else {
          alert('예약에 실패했습니다: ' + (data.msg || 'Unknown error'));
        }
      } catch (err) {
        alert('서버 오류로 예약에 실패했습니다.');
      }
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
  
    // Helper to get Singapore timestamp in YYYY-MM-DD THH:MM format
    function getSingaporeTimestamp() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} T${hours}:${minutes}`;
    }
  }); 