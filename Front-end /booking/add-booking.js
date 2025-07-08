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
      if (count === 0) radio.checked = true;
      const labelElem = document.createElement('label');
      labelElem.style.display = 'block';
      labelElem.appendChild(radio);
      labelElem.appendChild(document.createTextNode(' ' + label));
      dateOptionsDiv.appendChild(labelElem);
      count++;
    }
    dayOffset++;
  }
}); 