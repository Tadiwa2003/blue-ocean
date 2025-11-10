#!/bin/bash

echo "🔄 Restarting Blue Ocean Server"
echo "================================"
echo ""

# Find and kill existing server
SERVER_PID=$(ps aux | grep "node server/index.js" | grep -v grep | awk '{print $2}')

if [ ! -z "$SERVER_PID" ]; then
  echo "Stopping existing server (PID: $SERVER_PID)..."
  kill $SERVER_PID 2>/dev/null
  sleep 2
  
  # Force kill if still running
  if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "Force stopping server..."
    kill -9 $SERVER_PID 2>/dev/null
  fi
  echo "✅ Server stopped"
else
  echo "No server process found"
fi

echo ""
echo "Starting server..."
echo ""

# Start server in background
npm run server > server.log 2>&1 &
NEW_PID=$!

sleep 3

# Check if server started successfully
if ps -p $NEW_PID > /dev/null 2>&1; then
  echo "✅ Server started (PID: $NEW_PID)"
  echo ""
  echo "Checking MongoDB connection..."
  sleep 2
  
  # Test sign-in endpoint
  echo ""
  echo "Testing sign-in endpoint..."
  curl -X POST http://localhost:3001/api/auth/signin \
    -H 'Content-Type: application/json' \
    --data '{"email":"founder@blueocean.co","password":"blueocean2024"}' \
    2>&1 | grep -E '"success"|"message"|"token"' | head -3
  
  echo ""
  echo "✅ Server logs: tail -f server.log"
else
  echo "❌ Failed to start server. Check server.log for errors."
  exit 1
fi

