# 🚀 Startup Guide - After Laptop Restart

## Quick Start (Recommended)

**After restarting your laptop, run:**
```bash
./start-everything.sh
```

This script will:
1. ✅ Check if MongoDB is running
2. ✅ Start MongoDB if needed
3. ✅ Check if server is running
4. ✅ Start the server

## Manual Steps

### Step 1: Start MongoDB

```bash
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
lsof -i :27017
```

You should see MongoDB listening on port 27017.

### Step 2: Start the Server

```bash
npm run server
```

**Verify server is running:**
```bash
lsof -i :3001
```

You should see Node.js listening on port 3001.

### Step 3: Check Status

```bash
./check-status.sh
```

This will show you:
- MongoDB status
- Server status
- Database connection status
- Number of products/services in database

## Troubleshooting

### MongoDB Won't Start

**Check MongoDB service:**
```bash
brew services list | grep mongodb
```

**Start manually:**
```bash
mongod --config /usr/local/etc/mongod.conf
```

**Check MongoDB logs:**
```bash
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Server Won't Start

**Check if port 3001 is in use:**
```bash
lsof -i :3001
```

**Kill existing process:**
```bash
lsof -ti :3001 | xargs kill -9
```

**Check server logs:**
```bash
tail -f server.log
```

### Database Connection Errors

**Verify MongoDB is running:**
```bash
lsof -i :27017
```

**Test MongoDB connection:**
```bash
mongosh blueocean
```

**Check .env file:**
```bash
cat .env | grep MONGODB_URI
```

Should show: `MONGODB_URI=mongodb://localhost:27017/blueocean`

## Auto-Start MongoDB on Boot (Optional)

To make MongoDB start automatically when your laptop boots:

```bash
brew services start mongodb-community
```

This sets up MongoDB as a macOS service that starts on boot.

## Quick Commands Reference

```bash
# Start everything
./start-everything.sh

# Check status
./check-status.sh

# Start MongoDB only
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Start server only
npm run server

# Check what's running
lsof -i :27017  # MongoDB
lsof -i :3001  # Server
```

## After Restart Checklist

- [ ] MongoDB is running (`lsof -i :27017`)
- [ ] Server is running (`lsof -i :3001`)
- [ ] Server responds (`curl http://localhost:3001/api/health`)
- [ ] Database has data (`./check-status.sh`)

---

**Remember:** Always start MongoDB before starting the server!

