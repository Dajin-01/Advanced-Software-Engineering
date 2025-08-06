document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('login-form');

    // 로그인 성공 메시지 표시 함수
    function showSuccessMessage(message) {
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
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // 에러 메시지 표시 함수
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // 이메일 형식 검사
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showErrorMessage('Please enter a valid email address.');
            return;
        }

        if (!password) {
            showErrorMessage('Please enter your password.');
            return;
        }

        // 로딩 상태 표시
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Logging in...';
        submitButton.disabled = true;

        console.log('Attempting login with:', { email, password: '***' });
        
        fetch("http://localhost:8081/api/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Login response:", data);

            if (data.code === 200) {
                // 로그인 성공
                console.log('User ID:', data.data.userId);
                console.log('Token:', data.data.token);
                console.log('User Role:', data.data.userRole);
                
                // 토큰과 사용자 정보를 로컬 스토리지에 저장
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('userRole', data.data.userRole);
                localStorage.setItem('userId', data.data.userId);
                localStorage.setItem('userEmail', data.data.email);
                localStorage.setItem('userName', data.data.fullName);
                
                showSuccessMessage("Login successful!");
                
                // 사용자 역할에 따라 다른 페이지로 리다이렉트
                setTimeout(() => {
                    if (data.data.userRole === 'admin') {
                        window.location.href = '../admin/admin.html';
                    } else {
                        window.location.href = '../booking/booking.html';
                    }
                }, 1500);
            } else {
                // 로그인 실패
                showErrorMessage(data.msg || "Invalid login credentials.");
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            showErrorMessage("Failed to connect to server. Please try again later.");
        })
        .finally(() => {
            // 버튼 상태 복원
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });

    // CSS 애니메이션 추가
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
});