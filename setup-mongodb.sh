#!/bin/bash

echo "🚀 MongoDB Setup Script for Blue Ocean"
echo "========================================"
echo ""

# Check if MongoDB is already running
if lsof -i :27017 > /dev/null 2>&1; then
    echo "✅ MongoDB is already running on port 27017"
    exit 0
fi

# Check if MongoDB is installed
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
    echo "Starting MongoDB..."
    brew services start mongodb-community 2>/dev/null || mongod --dbpath ~/data/db &
    sleep 3
    if lsof -i :27017 > /dev/null 2>&1; then
        echo "✅ MongoDB started successfully"
        exit 0
    fi
fi

# Check if Homebrew is available
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Please install Homebrew first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo "📦 Installing MongoDB Community Edition..."
echo "This may take a few minutes..."
echo ""

# Tap MongoDB repository
brew tap mongodb/brew

# Install MongoDB
brew install mongodb-community

# Start MongoDB service
echo ""
echo "🚀 Starting MongoDB..."
brew services start mongodb-community

# Wait for MongoDB to start
echo "⏳ Waiting for MongoDB to start..."
sleep 5

# Verify MongoDB is running
if lsof -i :27017 > /dev/null 2>&1; then
    echo "✅ MongoDB is now running on port 27017"
    echo ""
    echo "🎉 Setup complete! You can now restart your server:"
    echo "   npm run server"
else
    echo "⚠️  MongoDB may still be starting. Please wait a moment and check:"
    echo "   lsof -i :27017"
fi

