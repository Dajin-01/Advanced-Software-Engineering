#!/bin/bash

echo "🚀 JCU Gym Management System Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "💡 Download from: https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "💡 Download from: https://dev.mysql.com/downloads/"
    exit 1
fi

echo "✅ Node.js and MySQL are installed"

# Navigate to backend directory
cd Back-end

# Check if config.env exists
if [ ! -f "config.env" ]; then
    echo "📝 Creating config.env from template..."
    cp config.env.example config.env
    echo "✅ config.env created"
    echo "💡 Please edit config.env with your MySQL credentials"
else
    echo "✅ config.env already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit Back-end/config.env with your MySQL credentials"
echo "2. Start the server: cd Back-end && node server.js"
echo "3. Access the application at: http://localhost:8081"
echo ""
echo "Default admin account:"
echo "- Email: admin@gym.com"
echo "- Password: admin123" 