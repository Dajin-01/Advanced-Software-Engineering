document.addEventListener('DOMContentLoaded', function() {
    const idInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-button');

    // Enforce numeric input and max length
    idInput.maxLength = 8;
    idInput.pattern = '[0-9]{8}';
    idInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    loginButton.addEventListener('click', function(e) {
        e.preventDefault();

        if (!idInput.value || idInput.value.length !== 8) {
            alert('Please enter a valid 8-digit ID');
            return;
        }

        if (!passwordInput.value) {
            alert('Please enter your password');
            return;
        }

        // Redirect to booking page if validation passes
        window.location.href = '../booking.html';
    });
});
