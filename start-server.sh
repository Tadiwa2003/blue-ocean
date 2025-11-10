#!/bin/bash

# Start Blue Ocean Server
# This script ensures the server starts properly and stays running

cd "$(dirname "$0")"

echo "🚀 Starting Blue Ocean Server..."
echo ""

# Check if MongoDB is running
if ! lsof -i :27017 > /dev/null 2>&1; then
  echo "⚠️  MongoDB is not running. Starting MongoDB..."
  brew services start mongodb-community 2>/dev/null || {
    echo "❌ Failed to start MongoDB. Please start it manually:"
    echo "   brew services start mongodb-community"
    exit 1
  }
  sleep 3
fi

# Check if port 3001 is already in use
if lsof -i :3001 > /dev/null 2>&1; then
  echo "⚠️  Port 3001 is already in use. Stopping existing process..."
  lsof -ti :3001 | xargs kill -9 2>/dev/null
  sleep 2
fi

# Start the server
echo "✅ Starting server on http://localhost:3001"
echo ""

npm run server

