# JCU Gym Management System

A comprehensive gym management system built with Node.js backend and vanilla JavaScript frontend.

## Features

- User registration and authentication (Student/Staff/Admin)
- Gym equipment booking system
- Payment processing
- Admin dashboard with statistics
- Session management
- Responsive web interface

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

## Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Dajin-01/Advanced-Software-Engineering.git
cd Advanced-Software-Engineering
```

### 2. Database Setup

#### Option A: Using MySQL Command Line

1. **Start MySQL server**
2. **Login to MySQL:**
   ```bash
   mysql -u root -p
   ```
3. **Run the schema file:**
   ```bash
   source Back-end/database/schema.sql
   ```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the file `Back-end/database/schema.sql`
4. Execute the script

### 3. Environment Configuration

1. **Navigate to the backend directory:**
   ```bash
   cd Back-end
   ```

2. **Copy the environment template:**
   ```bash
   cp config.env.example config.env
   ```

3. **Edit the config.env file with your database credentials:**
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=jcu_gym_db
   DB_PORT=3306
   
   # JWT Configuration
   JWT_SECRET=your_secure_jwt_secret_here
   
   # Other configurations...
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Server

```bash
node server.js
```

The server will start on `http://localhost:8081`

## Default Admin Account

After running the database schema, you can login with the default admin account:

- **Email:** admin@jcu.edu.au
- **Password:** admin123

## Project Structure

```
Advanced-Software-Engineering/
├── Back-end/
│   ├── config/
│   │   ├── database.js
│   │   └── config.env
│   ├── controllers/
│   │   ├── authController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── booking.js
│   ├── database/
│   │   └── schema.sql
│   └── server.js
├── Front-end/
│   ├── admin/
│   ├── booking/
│   ├── login/
│   ├── payment/
│   ├── register/
│   └── ...
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/registration/createMembership` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get usage statistics

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking

### Payments
- `PUT /api/users/updatePayment` - Update payment information

## Troubleshooting

### Database Connection Issues

1. **Check MySQL service is running**
2. **Verify database credentials in config.env**
3. **Ensure database and tables exist**
4. **Check MySQL user permissions**

### Port Already in Use

If port 8081 is already in use, change the PORT in config.env:
```env
PORT=8082
```

### CORS Issues

If you're running the frontend on a different port, update CORS_ORIGIN in config.env:
```env
CORS_ORIGIN=http://localhost:3001
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.


