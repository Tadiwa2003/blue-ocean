# 🚀 Quick Start After Restart

## After Restarting Your Laptop

**Run this ONE command:**
```bash
npm start
```

Or:
```bash
./start-everything.sh
```

This will:
1. ✅ Check if MongoDB is running
2. ✅ Start MongoDB if needed  
3. ✅ Start the server
4. ✅ Verify everything is working

## Check Status Anytime

```bash
npm run status
```

Or:
```bash
./check-status.sh
```

## What Happens

1. **MongoDB Check**: Script checks if MongoDB is running on port 27017
2. **Auto-Start MongoDB**: If not running, starts MongoDB using Homebrew
3. **Server Check**: Checks if server is already running on port 3001
4. **Start Server**: Starts the Node.js server

## If Something Goes Wrong

**MongoDB won't start?**
```bash
brew services start mongodb-community
```

**Server won't start?**
```bash
# Kill existing process
lsof -ti :3001 | xargs kill -9

# Start fresh
npm run server
```

**Check logs:**
```bash
tail -f server.log
```

---

**That's it!** After restart, just run `npm start` and everything will work.

