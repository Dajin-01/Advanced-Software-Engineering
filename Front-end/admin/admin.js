// Global variables
let allUsers = [];
let filteredUsers = [];
let currentStats = null;
let timeSlotChart = null;
let dailyChart = null;

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUsers();
    loadStats();
});

// Authentication check
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '../login/login.html';
        return;
    }
    
    // Set admin name
    const adminName = localStorage.getItem('userName') || 'Gym Administrator';
    document.getElementById('adminName').textContent = adminName;
}

// Tab navigation
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data for the selected tab
    if (tabName === 'users') {
        loadUsers();
    } else if (tabName === 'stats') {
        loadStats();
    }
}

// Load users from API
async function loadUsers() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.code === 200) {
            allUsers = data.data;
            filteredUsers = [...allUsers];
            renderUsers();
            updateStats();
        } else {
            throw new Error(data.msg || 'Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('userTableBody').innerHTML = 
            '<tr><td colspan="7" class="error">Failed to load users: ' + error.message + '</td></tr>';
    }
}

// Render users in table
function renderUsers() {
    const tbody = document.getElementById('userTableBody');
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${user.mobile_number}</td>
            <td><span class="status-badge ${user.user_role}">${user.user_role}</span></td>
            <td><span class="status-badge ${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewUserDetails(${user.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredUsers = allUsers.filter(user => {
        const matchesSearch = user.full_name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilter || user.user_role === roleFilter;
        const matchesStatus = !statusFilter || 
                            (statusFilter === 'active' && user.is_active) ||
                            (statusFilter === 'inactive' && !user.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    renderUsers();
}

// Update summary statistics
function updateStats() {
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(user => user.is_active).length;
    const currentMonth = new Date().getMonth();
    const newUsers = allUsers.filter(user => {
        const userMonth = new Date(user.created_at).getMonth();
        return userMonth === currentMonth;
    }).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('newUsers').textContent = newUsers;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// View user details
async function viewUserDetails(userId) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/admin/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.code === 200) {
            const user = data.data;
            const modalBody = document.getElementById('userModalBody');
            
            modalBody.innerHTML = `
                <div class="user-details">
                    <div class="detail-row">
                        <span class="detail-label">Full Name:</span>
                        <span class="detail-value">${user.full_name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${user.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${user.mobile_number}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Role:</span>
                        <span class="detail-value">${user.user_role}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Gender:</span>
                        <span class="detail-value">${user.gender}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Birth Date:</span>
                        <span class="detail-value">${formatDate(user.birthdate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Emergency Contact:</span>
                        <span class="detail-value">${user.emergency_contact_name} (${user.emergency_contact_number})</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Membership Fee:</span>
                        <span class="detail-value">$${user.membership_fee}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Type:</span>
                        <span class="detail-value">${user.payment_type}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">${user.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Joined:</span>
                        <span class="detail-value">${formatDate(user.created_at)}</span>
                    </div>
                </div>
            `;
            
            document.getElementById('userModal').style.display = 'block';
        } else {
            throw new Error(data.msg || 'Failed to load user details');
        }
    } catch (error) {
        console.error('Error loading user details:', error);
        alert('Failed to load user details: ' + error.message);
    }
}

// Close user modal
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// Export to CSV
function exportToCSV() {
    if (filteredUsers.length === 0) {
        alert('No users to export');
        return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined'];
    const csvContent = [
        headers.join(','),
        ...filteredUsers.map(user => [
            `"${user.full_name}"`,
            `"${user.email}"`,
            `"${user.mobile_number}"`,
            `"${user.user_role}"`,
            `"${user.is_active ? 'Active' : 'Inactive'}"`,
            `"${formatDate(user.created_at)}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Load gym usage statistics
async function loadStats() {
    try {
        const token = localStorage.getItem('authToken');
        const period = document.getElementById('periodSelect').value;
        
        const response = await fetch(`/api/admin/stats?period=${period}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.code === 200) {
            console.log('Stats data received:', data);
            currentStats = data.data;
            console.log('currentStats set:', currentStats);
            updateStatsDisplay();
            renderStatsCharts();
        } else {
            throw new Error(data.msg || 'Failed to load statistics');
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Show error in charts
        document.getElementById('timeSlotChart').innerHTML = 'Failed to load data';
        document.getElementById('dailyChart').innerHTML = 'Failed to load data';
    }
}

// Update statistics display
function updateStatsDisplay() {
    if (!currentStats) return;

    document.getElementById('totalBookings').textContent = currentStats.totalBookings;
    
    // Calculate average daily bookings
    const daysInPeriod = currentStats.period === 'day' ? 1 : 
                        currentStats.period === 'week' ? 7 : 30;
    const avgBookings = currentStats.totalBookings / daysInPeriod;
    document.getElementById('avgBookings').textContent = Math.round(avgBookings * 10) / 10;
    
    // Active bookers (unique users who made bookings)
    const uniqueUsers = new Set(currentStats.topUsers.map(user => user.userId)).size;
    document.getElementById('activeBookers').textContent = uniqueUsers;

    // Update top users list
    const topUsersList = document.getElementById('topUsersList');
    if (currentStats.topUsers.length > 0) {
        topUsersList.innerHTML = currentStats.topUsers.map(user => `
            <div class="stats-item">
                <div class="user-info">
                    <div class="user-avatar">U</div>
                    <span>User ID: ${user.userId}</span>
                </div>
                <span class="count">${user.count} bookings</span>
            </div>
        `).join('');
    } else {
        topUsersList.innerHTML = '<p class="no-data">No booking data available</p>';
    }

    // Update busy periods list
    const busyPeriodsList = document.getElementById('busyPeriodsList');
    if (currentStats.busyPeriods.length > 0) {
        busyPeriodsList.innerHTML = currentStats.busyPeriods.map(period => `
            <div class="stats-item">
                <span>${period.timeSlot}</span>
                <span class="count">${period.count} bookings</span>
            </div>
        `).join('');
    } else {
        busyPeriodsList.innerHTML = '<p class="no-data">No booking data available</p>';
    }
}

// Render statistics charts using Chart.js
function renderStatsCharts() {
    console.log('renderStatsCharts called');
    console.log('currentStats:', currentStats);
    
    if (!currentStats) {
        console.log('No currentStats available');
        return;
    }

    // Destroy existing charts if they exist
    if (timeSlotChart) {
        timeSlotChart.destroy();
    }
    if (dailyChart) {
        dailyChart.destroy();
    }

    // Time slot distribution chart
    const timeSlotCtx = document.getElementById('timeSlotChart');
    console.log('timeSlotCtx:', timeSlotCtx);
    console.log('timeSlotStats:', currentStats.timeSlotStats);
    console.log('timeSlotStats keys:', Object.keys(currentStats.timeSlotStats));
    
    if (Object.keys(currentStats.timeSlotStats).length > 0) {
        const timeSlotData = Object.entries(currentStats.timeSlotStats);
        console.log('Creating time slot chart with data:', timeSlotData);
        
        timeSlotChart = new Chart(timeSlotCtx, {
            type: 'doughnut',
            data: {
                labels: timeSlotData.map(([slot, _]) => slot),
                datasets: [{
                    data: timeSlotData.map(([_, count]) => count),
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe',
                        '#43e97b',
                        '#38f9d7'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            usePointStyle: true,
                            font: {
                                size: 10
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed} bookings`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
        console.log('Time slot chart created successfully');
    } else {
        timeSlotCtx.style.display = 'flex';
        timeSlotCtx.style.alignItems = 'center';
        timeSlotCtx.style.justifyContent = 'center';
        timeSlotCtx.style.color = '#a0aec0';
        timeSlotCtx.style.fontStyle = 'italic';
        timeSlotCtx.style.border = '2px dashed #e2e8f0';
        timeSlotCtx.style.borderRadius = '10px';
        timeSlotCtx.innerHTML = 'No time slot data available';
    }

    // Daily booking trends chart
    const dailyCtx = document.getElementById('dailyChart');
    console.log('dailyCtx:', dailyCtx);
    console.log('dailyStats:', currentStats.dailyStats);
    console.log('dailyStats keys:', Object.keys(currentStats.dailyStats));
    
    if (Object.keys(currentStats.dailyStats).length > 0) {
        const dailyData = Object.entries(currentStats.dailyStats)
            .sort(([a], [b]) => new Date(a) - new Date(b));
        
        console.log('Creating daily chart with data:', dailyData);
        
        dailyChart = new Chart(dailyCtx, {
            type: 'line',
            data: {
                labels: dailyData.map(([date, _]) => new Date(date).toLocaleDateString()),
                datasets: [{
                    label: 'Bookings',
                    data: dailyData.map(([_, count]) => count),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} bookings`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
        console.log('Daily chart created successfully');
    } else {
        dailyCtx.style.display = 'flex';
        dailyCtx.style.alignItems = 'center';
        dailyCtx.style.justifyContent = 'center';
        dailyCtx.style.color = '#a0aec0';
        dailyCtx.style.fontStyle = 'italic';
        dailyCtx.style.border = '2px dashed #e2e8f0';
        dailyCtx.style.borderRadius = '10px';
        dailyCtx.innerHTML = 'No daily data available';
    }
}

// Refresh statistics
function refreshStats() {
    loadStats();
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = '../login/login.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for filtering
    document.getElementById('searchInput').addEventListener('input', filterUsers);
    document.getElementById('roleFilter').addEventListener('change', filterUsers);
    document.getElementById('statusFilter').addEventListener('change', filterUsers);
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('userModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}); 