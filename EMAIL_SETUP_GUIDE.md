# Email Setup Guide - Quick Reference

## Quick Check: Is Email Working?

### Check Server Logs
When you confirm a booking, look at your server console:

**✅ Email is working:**
- No email-related warnings
- Bookings are created successfully
- Check your inbox for confirmation emails

**⚠️ Email is NOT configured:**
```
[Email] Transporter not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS to enable notifications.
```

**❌ Email is configured but failing:**
```
[Email] Failed to notify concierge: [error]
[Email] Failed to send guest confirmation: [error]
```

---

## Quick Setup (Gmail Example)

1. **Create `.env` file** in your `server/` directory (if it doesn't exist)

2. **Add these lines:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_SECURE=false
EMAIL_FROM=your-email@gmail.com
SPA_CONCIERGE_EMAIL=Tanasbeautyboost@gmail.com
```

3. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Generate password for "Mail"
   - Use that 16-character password in `EMAIL_PASS`

4. **Restart your server:**
```bash
npm run server
# or
npm run dev:server
```

5. **Test it:**
   - Create a booking
   - Confirm it
   - Check your email inbox

---

## What Emails Are Sent?

### 1. Concierge Email
- **To:** `Tanasbeautyboost@gmail.com`
- **When:** Every booking confirmation
- **Contains:** Full booking details

### 2. Guest Email
- **To:** Guest's email (from booking form)
- **When:** Every booking confirmation
- **Contains:** Booking confirmation with details

---

## Current Status

**Email System:** ✅ Implemented and ready
**Email Configuration:** ⚠️ Needs to be set up
**Booking System:** ✅ Working (emails optional)

Even without email configuration, bookings work perfectly - they're saved to the database and can be viewed in the dashboard!

