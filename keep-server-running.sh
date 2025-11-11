#!/bin/bash

# Keep Blue Ocean Server Running
# This script monitors and restarts the server if it crashes

cd "$(dirname "$0")"

SERVER_PID_FILE="server.pid"
LOG_FILE="server.log"

# Function to start server
start_server() {
  echo "🚀 Starting Blue Ocean Server..."
  
  # Check MongoDB
  if ! lsof -i :27017 > /dev/null 2>&1; then
    echo "⚠️  Starting MongoDB..."
    brew services start mongodb-community 2>/dev/null
    sleep 3
  fi
  
  # Kill any existing server on port 3001
  lsof -ti :3001 | xargs kill -9 2>/dev/null
  sleep 1
  
  # Start server in background
  nohup npm run server > "$LOG_FILE" 2>&1 &
  echo $! > "$SERVER_PID_FILE"
  
  echo "✅ Server started (PID: $(cat $SERVER_PID_FILE))"
  echo "📝 Logs: tail -f $LOG_FILE"
  
  # Wait a moment and verify it's running
  sleep 3
  if ps -p $(cat "$SERVER_PID_FILE") > /dev/null 2>&1; then
    echo "✅ Server is running on http://localhost:3001"
    return 0
  else
    echo "❌ Server failed to start. Check $LOG_FILE"
    return 1
  fi
}

# Function to check if server is running
check_server() {
  if [ -f "$SERVER_PID_FILE" ]; then
    PID=$(cat "$SERVER_PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
      # Check if it's actually responding
      if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        return 0
      fi
    fi
  fi
  return 1
}

# Main loop
if [ "$1" == "monitor" ]; then
  echo "👀 Monitoring server (Ctrl+C to stop)..."
  while true; do
    if ! check_server; then
      echo "$(date): Server not responding, restarting..."
      start_server
    fi
    sleep 10
  done
else
  # Just start once
  start_server
fi

