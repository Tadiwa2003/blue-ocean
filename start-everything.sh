#!/bin/bash

# Start Everything Script
# This script ensures MongoDB and the server start correctly

cd "$(dirname "$0")"

echo "🚀 Starting Blue Ocean Environment"
echo "==================================="
echo ""

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check MongoDB
echo "📦 Checking MongoDB..."
if ! lsof -i :27017 > /dev/null 2>&1; then
  echo "⚠️  MongoDB is not running. Starting MongoDB..."
  
  if command_exists brew; then
    brew services start mongodb-community 2>/dev/null || {
      echo "❌ Failed to start MongoDB with brew services"
      echo "💡 Try manually: brew services start mongodb-community"
      exit 1
    }
    echo "⏳ Waiting for MongoDB to start..."
    sleep 5
    
    # Verify MongoDB started
    if lsof -i :27017 > /dev/null 2>&1; then
      echo "✅ MongoDB started successfully"
    else
      echo "❌ MongoDB failed to start. Please check:"
      echo "   brew services list | grep mongodb"
      exit 1
    fi
  else
    echo "❌ Homebrew not found. Please start MongoDB manually:"
    echo "   mongod --config /usr/local/etc/mongod.conf"
    exit 1
  fi
else
  echo "✅ MongoDB is already running"
fi

echo ""

# Check if server is already running
echo "🔍 Checking server status..."
if lsof -i :3001 > /dev/null 2>&1; then
  echo "⚠️  Server is already running on port 3001"
  echo "   To restart, stop it first: lsof -ti :3001 | xargs kill"
  read -p "   Stop existing server and start new one? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 Stopping existing server..."
    lsof -ti :3001 | xargs kill -9 2>/dev/null
    sleep 2
  else
    echo "✅ Keeping existing server running"
    exit 0
  fi
fi

# Start server
echo "🚀 Starting Blue Ocean server..."
echo ""

npm run server

