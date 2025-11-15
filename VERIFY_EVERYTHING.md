# ✅ Complete System Verification Guide

## 🎯 Quick Verification Checklist

### 1. ✅ Email System
- **Concierge Email:** `tadiwachoga2003@gmail.com` (hardcoded, always used)
- **Status:** ✅ Code is ready, needs Gmail credentials in `server/.env`
- **Action Required:** Update `server/.env` with real Gmail App Password

### 2. ✅ Development Server
- **Frontend:** Port 5178 (Vite)
- **Backend:** Port 3001 (Express)
- **Start Command:** `npm run dev:all` (runs both)

### 3. ✅ Booking System
- **Date/Time Validation:** ✅ Working
- **Email Notifications:** ✅ Ready (needs email credentials)
- **Database:** ✅ MongoDB configured

## 🚀 Start Everything

### Option 1: Start Both Frontend & Backend
```bash
npm run dev:all
```

### Option 2: Start Separately
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Option 3: Use Startup Script
```bash
npm start
# or
./start-everything.sh
```

## 📧 Email Setup (REQUIRED for Booking Notifications)

### Step 1: Get Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select "Mail" → "Other (Custom name)"
4. Enter: "Spa Booking System"
5. Click "Generate"
6. **Copy the 16-character password**

### Step 2: Update `server/.env`
```env
EMAIL_USER=tadiwachoga2003@gmail.com
EMAIL_PASS=your-16-character-app-password-here
EMAIL_FROM=tadiwachoga2003@gmail.com
```

### Step 3: Restart Server
```bash
# Stop server (Ctrl+C)
npm run server
```

### Step 4: Verify
Look for this in console:
```
[Email] ✅ Email transporter configured successfully
[Email] 📧 Concierge email: tadiwachoga2003@gmail.com
```

## 🧪 Test Booking Flow

1. **Start servers:**
   ```bash
   npm run dev:all
   ```

2. **Open browser:**
   - Frontend: http://localhost:5178
   - Backend API: http://localhost:3001/api/health

3. **Test booking:**
   - Navigate to Beauty Spa Storefront
   - Select a service
   - Choose date/time (must be future)
   - Add guest information
   - Confirm booking

4. **Check console logs:**
   ```
   [Booking] ✅ Created 1 booking(s) in database
   [Booking] 📧 Preparing to send email notifications...
   [Email] ✅✅✅ SUCCESS: Concierge notification sent to: tadiwachoga2003@gmail.com
   ```

5. **Check email:**
   - Check `tadiwachoga2003@gmail.com` inbox
   - Check spam folder if not in inbox

## 🔍 Troubleshooting

### Server Won't Start
```bash
# Check if port is in use
lsof -i :3001
lsof -i :5178

# Kill process if needed
lsof -ti :3001 | xargs kill -9
lsof -ti :5178 | xargs kill -9

# Start fresh
npm run dev:all
```

### MongoDB Not Running
```bash
# Check status
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community

# Verify
lsof -i :27017
```

### Email Not Sending
1. **Check `.env` file:**
   ```bash
   cat server/.env | grep EMAIL
   ```

2. **Verify credentials are NOT placeholders:**
   - ❌ `EMAIL_USER=your-email@gmail.com` (placeholder)
   - ✅ `EMAIL_USER=tadiwachoga2003@gmail.com` (real)

3. **Check server logs:**
   - Look for `[Email] ✅ Email transporter configured successfully`
   - If you see warnings, credentials are wrong

4. **Test connection:**
   - Server will verify email config on startup
   - Check console for email verification messages

### CORS Errors
- Backend allows: `http://localhost:5178` and all `localhost` ports
- If you see CORS errors, check `server/index.js` CORS config

## 📋 All Recent Changes

### ✅ Email System
- Concierge email hardcoded to `tadiwachoga2003@gmail.com`
- Enhanced validation and error handling
- Comprehensive logging for debugging
- Better error messages

### ✅ Booking System
- Date/time validation (no past dates)
- Auto-correction for invalid dates
- Enhanced error messages
- Proper data validation

### ✅ Server Configuration
- Port 3001 for backend
- Port 5178 for frontend
- CORS properly configured
- MongoDB connection handling

## 🎯 Next Steps

1. **Update email credentials** in `server/.env`
2. **Start servers** with `npm run dev:all`
3. **Test booking flow** end-to-end
4. **Verify emails** are received at `tadiwachoga2003@gmail.com`

## ✅ Success Indicators

When everything is working, you'll see:

**Server Console:**
```
🚀 Blue Ocean API server running on http://localhost:3001
📡 Frontend URL: http://localhost:5178
💾 Database: MongoDB Connected
[Email] ✅ Email transporter configured successfully
```

**Browser:**
- Frontend loads at http://localhost:5178
- No console errors
- Booking flow works smoothly
- Success messages appear

**Email:**
- Booking confirmation received at `tadiwachoga2003@gmail.com`
- Guest receives confirmation email
- All booking details included

---

**Everything is ready! Just update the email credentials and you're good to go! 🚀**

