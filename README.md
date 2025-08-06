# JCU Gym Management System

A comprehensive gym management system built with Node.js backend and vanilla JavaScript frontend.

## Team - Practical Class A (Group 1)

1. Dajin Kim
2. Lin Pyae Htet
3. Chen Xingjian
4. Fan Yiqi

## Project Overview

A website for "MyGym": a platform focused on providing gym services to JCU students while JCU staffs manage bookings and their memberships. Students can register for membership on the website and book their gym sessions conveniently without having to go to the university. The website will also feature an AI-powered trainer that will improve students' workout experience. The website will have revenue generated through gym membership subscriptions.

## Goals
MyGym aims to revolutionize the gym experience for JCU students by providing a centralized online platform for booking facilities and accessing personalized fitness services. By leveraging AI technology, the platform will offer tailored exercise recommendations that align with each user's goals and physical condition, helping them achieve better results safely and efficiently. MyGym will generate revenue through a subscription-based membership model, ensuring sustainability while maintaining a high level of service quality. 

## Team Roles

Lin Pyae Htet - GUI, Front-end

Da Jin Kim - GUI, Front-end

Chen Xingjian - Back-end, Cloud service like AWS

Fan Yiqi - Design, Document

## Features

- User registration and authentication (Student/Staff/Admin)
- Gym equipment booking system
- Payment processing
- Admin dashboard with statistics
- Session management
- Responsive web interface
- AI-powered trainer recommendations

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

### 2. Quick Setup (Recommended)

Run the automatic setup script:

```bash
./setup.sh
```

This script will:
- Check if Node.js and MySQL are installed
- Create config.env from template
- Install dependencies
- Provide next steps

### 3. Manual Setup

#### Database Setup

#### Option A: Automatic Setup (Recommended)
The application will automatically create the database and tables when you start the server for the first time. Just make sure your MySQL credentials are correct in `config.env`.

#### Option B: Manual Setup using MySQL Command Line

1. **Start MySQL server**
2. **Login to MySQL:**
   ```bash
   mysql -u root -p
   ```
3. **Run the schema file:**
   ```bash
   source Back-end/database/schema.sql
   ```

#### Option C: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the file `Back-end/database/schema.sql`
4. Execute the script

#### Environment Configuration

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

#### Install Dependencies

```bash
npm install
```

#### Start the Server

```bash
node server.js
```

The server will start on `http://localhost:8081`

## Default Admin Account

After running the database schema, you can login with the default admin account:

- **Email:** admin@gym.com
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

### Common Issues

#### 1. Express Module Not Found
```bash
Error: Cannot find module './lib/express'
```
**Solution:**
```bash
cd Back-end
rm -rf node_modules package-lock.json
npm install
```

#### 2. MySQL Connection Failed
```bash
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solutions:**
- **macOS:** `brew services start mysql`
- **Windows:** Start MySQL service from Services
- **Linux:** `sudo systemctl start mysql`

#### 3. Database Access Denied
```bash
Error: Access denied for user 'jcu_user'@'localhost'
```
**Solutions:**
```bash
# Method 1: Try enhanced database setup
npm run setup-db

# Method 2: Reset MySQL and setup again
npm run fix-db

# Method 3: Manual reset (if above methods fail)
npm run reset-mysql
npm run setup-db
```

#### 4. Port Already in Use
```bash
Error: listen EADDRINUSE :::8081
```
**Solution:**
- Change port in `Back-end/config.env`
- Or kill the process using the port: `lsof -ti:8081 | xargs kill -9`

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

## System Requirements

- **Node.js:** v14 or higher
- **MySQL:** v8.0 or higher
- **npm:** v6.0 or higher

## Supported Operating Systems

- macOS (10.14 or higher)
- Windows (10 or higher)
- Linux (Ubuntu 18.04+, CentOS 7+)

## Actual iterations
1. [Iteration-1](./iteration_1.md)
2. [Iteration-2](./iteration_2.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.


