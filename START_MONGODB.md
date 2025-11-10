# Quick Start MongoDB Guide

## MongoDB is Required for Sign-In to Work

The application uses MongoDB for user authentication and data storage. **MongoDB must be running** for sign-in to work.

## Option 1: Install and Start MongoDB (Recommended for Development)

### macOS:
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb
```

### Windows:
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and MongoDB will start automatically as a service

### Linux:
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Option 2: Use MongoDB Atlas (Cloud - No Installation Needed)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blueocean
   ```

## Verify MongoDB is Running

```bash
# Check if MongoDB is running
curl http://localhost:27017 2>&1 | head -1

# Or check process
ps aux | grep mongod
```

## After Starting MongoDB

1. Restart the server:
   ```bash
   npm run server
   ```

2. You should see:
   ```
   ✅ MongoDB Connected: localhost
   ✅ Created default user: founder@blueocean.co
   ```

3. Test sign-in:
   ```bash
   curl -X POST http://localhost:3001/api/auth/signin \
     -H 'Content-Type: application/json' \
     --data '{"email":"founder@blueocean.co","password":"blueocean2024"}'
   ```

## Default Users (Created Automatically)

- **Owner**: founder@blueocean.co / blueocean2024
- **Admin**: admin@blueocean.co / admin123
- **User**: user@blueocean.co / user123

---

**Note**: The server will start without MongoDB, but authentication endpoints will return a 503 error until MongoDB is connected.

