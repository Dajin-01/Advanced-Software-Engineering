document.addEventListener('DOMContentLoaded', function() {
    const deleteButton = document.querySelector('.action-button:last-child');

    deleteButton.addEventListener('click', function() {
        // Get fresh checkbox selections each time
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedBookings = Array.from(checkboxes).filter(checkbox => checkbox.checked);
        
        if (selectedBookings.length === 0) {
            alert('Please select a booking to delete');
            return;
        }

        // If a booking is selected, confirm deletion
        if (confirm('Are you sure you want to delete the selected booking?')) {
            // Get the row of the selected booking
            const selectedRow = selectedBookings[0].closest('tr');
            // Remove the row from the table
            selectedRow.remove();
        }
    });
}); 