#!/bin/bash

# Auto-Start Script - Runs automatically
# This ensures MongoDB and server are always running

cd "$(dirname "$0")"

LOG_FILE="auto-start.log"
PID_FILE="auto-start.pid"

# Function to log messages
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Function to check if process is running
is_running() {
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

# Function to start MongoDB
start_mongodb() {
  if ! lsof -i :27017 > /dev/null 2>&1; then
    log "Starting MongoDB..."
    brew services start mongodb-community 2>&1 >> "$LOG_FILE"
    sleep 3
    
    if lsof -i :27017 > /dev/null 2>&1; then
      log "✅ MongoDB started"
      return 0
    else
      log "❌ MongoDB failed to start"
      return 1
    fi
  else
    log "✅ MongoDB already running"
    return 0
  fi
}

# Function to start server
start_server() {
  if ! lsof -i :3001 > /dev/null 2>&1; then
    log "Starting server..."
    
    # Kill any existing server process
    lsof -ti :3001 | xargs kill -9 2>/dev/null
    sleep 1
    
    # Start server
    nohup npm run server >> server.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > server.pid
    
    sleep 5
    
    if ps -p $SERVER_PID > /dev/null 2>&1; then
      log "✅ Server started (PID: $SERVER_PID)"
      
      # Test server
      sleep 2
      if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        log "✅ Server is responding"
        return 0
      else
        log "⚠️  Server started but not responding yet"
        return 0
      fi
    else
      log "❌ Server failed to start"
      return 1
    fi
  else
    log "✅ Server already running"
    return 0
  fi
}

# Main function
main() {
  log "=== Auto-start check ==="
  
  # Start MongoDB
  start_mongodb
  
  # Start server
  start_server
  
  log "=== Auto-start complete ==="
  echo ""
}

# Run main function
main

# If running as monitor mode, check every 30 seconds
if [ "$1" == "monitor" ]; then
  echo "👀 Monitoring mode - checking every 30 seconds..."
  echo "Press Ctrl+C to stop"
  
  while true; do
    sleep 30
    main
  done
else
  echo "✅ Auto-start complete. Run './auto-start.sh monitor' for continuous monitoring."
fi

