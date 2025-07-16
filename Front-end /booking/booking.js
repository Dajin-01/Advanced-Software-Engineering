document.addEventListener('DOMContentLoaded', function() {
    const deleteButton = document.querySelector('.action-button:last-child');

    deleteButton.addEventListener('click', function() {
        // Get fresh checkbox selections each time
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedBookings = Array.from(checkboxes).filter(checkbox => checkbox.checked);
        
        if (selectedBookings.length === 0) {
            alert('Please select at least one booking to delete');
            return;
        }

        // Confirm deletion for multiple bookings
        const message = selectedBookings.length === 1 
            ? 'Are you sure you want to delete the selected booking?' 
            : `Are you sure you want to delete ${selectedBookings.length} selected bookings?`;
        
        if (confirm(message)) {
            // Remove all selected rows from the table
            selectedBookings.forEach(checkbox => {
                const row = checkbox.closest('tr');
                row.remove();
            });
        }
    });

    // Load and display bookings
    loadBookings();
});

function loadBookings() {
    const tbody = document.querySelector('.booking-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    // Add hardcoded bookings
    const hardcodedBookings = [
        {
            reference: 'JYM2025100001',
            userName: 'Dajin Kim',
            bookingDate: '14-5-2025',
            bookingTime: '09:00:00',
            bookedOn: '2025-05-13 T14:53',
            bookedBy: 'Dajin Kim'
        },
        {
            reference: 'JYM2025100002',
            userName: 'Dajin Kim',
            bookingDate: '30-5-2025',
            bookingTime: '09:00:00',
            bookedOn: '2025-05-29 T14:53',
            bookedBy: 'Dajin Kim'
        }
    ];

    // Get dynamic bookings from sessionStorage (temporary for demo)
    const dynamicBookings = JSON.parse(sessionStorage.getItem('bookings') || '[]');

    // Combine all bookings
    const allBookings = [...hardcodedBookings, ...dynamicBookings];

    // Display all bookings
    allBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td><strong>${booking.reference}</strong></td>
            <td><em>${booking.userName}</em></td>
            <td><strong>${booking.bookingDate}</strong></td>
            <td><strong>${booking.bookingTime}</strong></td>
            <td><strong>${booking.bookedOn}</strong></td>
            <td><em>${booking.bookedBy}</em></td>
        `;
        tbody.appendChild(row);
    });
} 