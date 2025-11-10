# 🔧 Fix Sign-In Issue - Do This Now

## Problem
The server is running **old MySQL code** and needs to be restarted to use MongoDB.

## Quick Fix

**Option 1: Use the restart script**
```bash
./restart-server.sh
```

**Option 2: Manual restart**
1. Find the server process:
   ```bash
   ps aux | grep "node server/index.js"
   ```

2. Kill it (replace PID with actual process ID):
   ```bash
   kill <PID>
   ```

3. Start fresh:
   ```bash
   npm run server
   ```

## Verify It Works

After restarting, you should see:
```
✅ MongoDB Connected: mongodb://localhost:27017/blueocean
✅ Created default user: founder@blueocean.co
🚀 Blue Ocean API server running on http://localhost:3001
💾 Database: MongoDB Connected
```

## Test Sign-In

```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H 'Content-Type: application/json' \
  --data '{"email":"founder@blueocean.co","password":"blueocean2024"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "user_owner_001",
      "name": "Kim Moyo",
      "email": "founder@blueocean.co",
      "role": "owner"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Current Status

- ✅ MongoDB is running
- ✅ Code is updated to MongoDB
- ✅ MongoDB connection test passes
- ⚠️ **Server needs restart** (currently running old code)

**Restart the server now!**

