#!/bin/bash

# JCU Gym Management System - Installation Script
# This script will set up the entire project environment

set -e  # Exit on any error

echo "🚀 JCU Gym Management System - Installation Script"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Attempting to install..."
    
    # Detect OS and install MySQL
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "📦 Installing MySQL via Homebrew..."
            brew install mysql
            brew services start mysql
        else
            echo "❌ Homebrew is not installed. Please install Homebrew first:"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            echo "📦 Installing MySQL via apt..."
            sudo apt-get update
            sudo apt-get install -y mysql-server
            sudo systemctl start mysql
            sudo systemctl enable mysql
        elif command -v yum &> /dev/null; then
            echo "📦 Installing MySQL via yum..."
            sudo yum install -y mysql-server
            sudo systemctl start mysqld
            sudo systemctl enable mysqld
        else
            echo "❌ Unsupported package manager. Please install MySQL manually."
            exit 1
        fi
    else
        echo "❌ Unsupported operating system. Please install MySQL manually."
        exit 1
    fi
fi

echo "✅ MySQL is available"

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm run install-all

# Copy environment file if it doesn't exist
if [ ! -f "Back-end/config.env" ]; then
    echo "📝 Creating environment configuration..."
    cp Back-end/config.env.example Back-end/config.env
    echo "✅ Environment file created. Please edit Back-end/config.env if needed."
else
    echo "✅ Environment file already exists"
fi

# Setup database
echo "🗄️  Setting up database..."
cd Back-end
node scripts/setup-database.js
if [ $? -ne 0 ]; then
    echo "⚠️  Database setup failed. Trying to reset MySQL..."
    cd ..
    npm run reset-mysql
    cd Back-end
    node scripts/setup-database.js
fi
cd ..

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit Back-end/config.env if you need to change database settings"
echo "2. Run 'npm start' to start the server"
echo "3. Open http://localhost:8081 in your browser"
echo ""
echo "🔧 Default admin account:"
echo "   Email: admin@jcu.edu.au"
echo "   Password: admin123"
echo ""
echo "📚 For more information, see README.md" 