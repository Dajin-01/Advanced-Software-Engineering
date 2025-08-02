@echo off
setlocal enabledelayedexpansion

echo 🚀 MY Gym Management System - Installation Script
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MySQL is not installed. Please install MySQL manually.
    echo    Download from: https://dev.mysql.com/downloads/mysql/
    echo    After installation, make sure MySQL service is running.
    pause
)

echo ✅ MySQL is available

REM Install dependencies
echo 📦 Installing Node.js dependencies...
call npm run install-all

REM Copy environment file if it doesn't exist
if not exist "Back-end\config.env" (
    echo 📝 Creating environment configuration...
    copy "Back-end\config.env.example" "Back-end\config.env"
    echo ✅ Environment file created. Please edit Back-end\config.env if needed.
) else (
    echo ✅ Environment file already exists
)

REM Setup database
echo 🗄️  Setting up database...
cd Back-end
node scripts\setup-database.js
cd ..

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit Back-end\config.env if you need to change database settings
echo 2. Run 'npm start' to start the server
echo 3. Open http://localhost:8081 in your browser
echo.
echo 🔧 Default admin account:
echo    Email: admin@jcu.edu.au
echo    Password: admin123
echo.
echo 📚 For more information, see README.md
pause 