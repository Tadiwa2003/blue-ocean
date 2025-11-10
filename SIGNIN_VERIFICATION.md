# Sign-In Verification Guide

## ✅ MongoDB Status
- MongoDB is running on port 27017
- Database: `blueocean`
- Default user exists: `founder@blueocean.co`

## Test Sign-In

### 1. Start the Server
```bash
npm run server
```

You should see:
```
✅ MongoDB Connected: mongodb://localhost:27017/blueocean
✅ Created default user: founder@blueocean.co
🚀 Blue Ocean API server running on http://localhost:3001
💾 Database: MongoDB Connected
```

### 2. Test Sign-In Endpoint

**Using curl:**
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
      "role": "owner",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Test from Frontend

1. Open http://localhost:5173
2. Click "Sign In"
3. Enter:
   - Email: `founder@blueocean.co`
   - Password: `blueocean2024`
4. Click "Sign In"

You should be redirected to the dashboard.

## Default Users

- **Owner**: founder@blueocean.co / blueocean2024
- **Admin**: admin@blueocean.co / admin123
- **User**: user@blueocean.co / user123

## Troubleshooting

### "Database is not available"
- Check MongoDB is running: `lsof -i :27017`
- Start MongoDB: `brew services start mongodb-community`

### "Invalid email or password"
- Verify user exists in database
- Check password is correct
- Verify password is hashed correctly in database

### "JWT_SECRET not set"
- Add `JWT_SECRET=your_secret_key` to `.env`
- Restart server

## Verification Checklist

- ✅ MongoDB running
- ✅ Database connected
- ✅ Default users created
- ✅ Sign-in endpoint accessible
- ✅ Password hashing works
- ✅ JWT token generation works
- ✅ Frontend can connect to API

