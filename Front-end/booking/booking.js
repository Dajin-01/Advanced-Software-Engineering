document.addEventListener('DOMContentLoaded', function() {
    const deleteButton = document.querySelector('.action-button:last-child');

    deleteButton.addEventListener('click', async function() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedBookings = Array.from(checkboxes).filter(checkbox => checkbox.checked);
        if (selectedBookings.length === 0) {
            alert('Please select at least one booking to delete');
            return;
        }
        const message = selectedBookings.length === 1 
            ? 'Are you sure you want to delete the selected booking?'
            : `Are you sure you want to delete ${selectedBookings.length} selected bookings?`;
        if (confirm(message)) {
            const token = localStorage.getItem('authToken');
            const deletePromises = selectedBookings.map(checkbox => {
                const bookingId = checkbox.getAttribute('data-id');
                return fetch(`/api/bookings/${bookingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            });
            await Promise.all(deletePromises);
            loadBookings();
        }
    });

    // Load and display bookings
    loadBookings();
});

async function loadBookings() {
    const tbody = document.querySelector('.booking-table tbody');
    tbody.innerHTML = '';
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch('/api/bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (data.code === 200 && data.bookings.length > 0) {
            data.bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" data-id="${booking.id}"></td>
                    <td><strong>${booking.reference}</strong></td>
                    <td><em>${booking.booked_by}</em></td>
                    <td><strong>${formatBookingDate(booking.booking_date)}</strong></td>
                    <td><strong>${booking.booking_time}</strong></td>
                    <td><strong>${formatBookedOn(booking.booked_on)}</strong></td>
                    <td><em>${booking.booked_by}</em></td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7">Error loading bookings.</td></tr>';
    }
}

function formatBookingDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
}
function formatBookedOn(dtStr) {
    if (!dtStr) return '';
    return dtStr.replace('T', ' ').slice(0, 16);
} 