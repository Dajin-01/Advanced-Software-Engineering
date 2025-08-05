# MY Gym Management System

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

## Quick Start (Recommended)

### Option 1: Automated Installation

**For macOS/Linux:**
```bash
git clone https://github.com/Dajin-01/Advanced-Software-Engineering.git
cd Advanced-Software-Engineering
chmod +x install.sh
./install.sh
```

**For Windows:**
```bash
git clone https://github.com/Dajin-01/Advanced-Software-Engineering.git
cd Advanced-Software-Engineering
install.bat
```

### Option 2: Manual Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Dajin-01/Advanced-Software-Engineering.git
cd Advanced-Software-Engineering
```

#### 2. Install Dependencies

```bash
npm run install-all
```

#### 3. Setup Database

```bash
npm run setup-db
```

#### 4. Configure Environment

```bash
cp Back-end/config.env.example Back-end/config.env
# Edit Back-end/config.env if needed
```

#### 5. Start the Server

```bash
npm start
```

The server will start on `http://localhost:8081`

## Manual Database Setup (Alternative)

If the automated setup doesn't work, you can set up the database manually:

### Option A: Using MySQL Command Line

1. **Start MySQL server**
2. **Login to MySQL:**
   ```bash
   mysql -u root -p
   ```
3. **Run the schema file:**
   ```bash
   source Back-end/database/schema.sql
   ```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the file `Back-end/database/schema.sql`
4. Execute the script

### Environment Configuration

Edit `Back-end/config.env` with your database credentials:

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

## Default Admin Account

After running the database schema, you can login with the default admin account:

- **Email:** admin@jcu.edu.au
- **Password:** admin123

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

### System Requirements

- **Node.js:** v14 or higher
- **MySQL:** v8.0 or higher
- **npm:** v6.0 or higher

### Supported Operating Systems

- macOS (10.14 or higher)
- Windows (10 or higher)
- Linux (Ubuntu 18.04+, CentOS 7+)

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


