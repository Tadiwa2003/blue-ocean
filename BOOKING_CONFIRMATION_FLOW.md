# Booking Confirmation Flow & Email System

## What Happens When "Confirm Booking" is Pressed

### Step-by-Step Process

#### 1. **Frontend Validation (BookingDrawer)**
When user clicks "Confirm Booking" button:
- ✅ Validates email format
- ✅ Validates all bookings have valid ISO dates
- ✅ Validates dates are not in the past
- ✅ Validates times are present
- ✅ Auto-fixes past dates to tomorrow when possible
- ✅ Shows error messages if validation fails

#### 2. **Frontend Processing (handleConfirmBookings)**
If validation passes:
- ✅ Transforms bookings to match backend API format
- ✅ Converts dates to ISO format (YYYY-MM-DD)
- ✅ Validates all required fields
- ✅ Auto-fixes past dates if needed
- ✅ Prepares booking data for API submission

#### 3. **API Call**
```javascript
POST /api/bookings
Body: { bookings: [booking1, booking2, ...] }
```

#### 4. **Backend Processing (bookingController.js)**
- ✅ Validates all booking data
- ✅ Checks date format (ISO YYYY-MM-DD)
- ✅ Validates dates are not in the past
- ✅ Validates time format
- ✅ Validates email format
- ✅ Creates bookings in MongoDB database
- ✅ **Sends email notifications** (fire-and-forget)

#### 5. **Success Response**
- ✅ Returns success response with created bookings
- ✅ Frontend shows success notification
- ✅ Clears bookings from state
- ✅ Clears localStorage
- ✅ Closes booking drawer after 2.5 seconds

---

## Email Notification System

### How It Works

The system sends **TWO emails** for each booking:

#### 1. **Concierge Notification Email**
- **To:** `Tanasbeautyboost@gmail.com` (or `SPA_CONCIERGE_EMAIL` env variable)
- **Subject:** `New Booking: [Service Name] ([Date])`
- **Content:** Booking summary with all details

#### 2. **Guest Confirmation Email**
- **To:** Guest's email address (from booking form)
- **Subject:** `Booking Confirmation: [Service Name]`
- **Content:** Personalized confirmation with booking details

### Email Content Format

**Concierge Email:**
```
A new booking has been created:

Guest: [Guest Name]
Email: [Guest Email]
Phone: [Guest Phone]
Service: [Service Name]
Date: [Date] at [Time]
Total: [Currency] [Price]
Add-ons: [Add-on names]
Notes: [Guest notes]
```

**Guest Email:**
```
Hi [Guest Name],

Thank you for booking with Tana's Beauty Boost. Here are your booking details:

[Same booking summary as above]

We look forward to seeing you!
```

---

## Email Configuration

### Required Environment Variables

For emails to work, you need to set these in your `.env` file:

```env
# Email Server Configuration
EMAIL_HOST=smtp.gmail.com          # Your SMTP server
EMAIL_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
EMAIL_USER=your-email@gmail.com    # Your email address
EMAIL_PASS=your-app-password       # Your email password or app password
EMAIL_SECURE=false                 # true for SSL (port 465), false for TLS (port 587)
EMAIL_FROM=your-email@gmail.com    # Optional: From address (defaults to EMAIL_USER)

# Spa Concierge Email (Optional)
SPA_CONCIERGE_EMAIL=Tanasbeautyboost@gmail.com
```

### Email Status Check

The system checks if email is configured:
- ✅ **If configured:** Emails are sent automatically
- ⚠️ **If NOT configured:** 
  - System logs a warning: `[Email] Transporter not configured`
  - Bookings are still created successfully
  - No emails are sent
  - No error is shown to the user

### Current Status

**To check if email is working:**
1. Look at server console logs when booking is confirmed
2. If you see: `[Email] Transporter not configured` → Email is NOT set up
3. If you see: `[Email] Failed to send...` → Email is configured but failing
4. If no email errors → Emails should be sending

---

## Email Setup Instructions

### For Gmail

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password

3. **Add to `.env` file:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   EMAIL_SECURE=false
   EMAIL_FROM=your-email@gmail.com
   ```

4. **Restart your server** to load new environment variables

### For Other Email Providers

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Custom SMTP:**
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

---

## Testing Email Functionality

### 1. Check Server Logs
When a booking is confirmed, check your server console:

**If email is configured:**
```
[Email] Sending booking notifications...
```

**If email is NOT configured:**
```
[Email] Transporter not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS to enable notifications.
```

**If email fails:**
```
[Email] Failed to notify concierge: [error details]
[Email] Failed to send guest confirmation: [error details]
```

### 2. Test Booking
1. Create a test booking with your email
2. Confirm the booking
3. Check your inbox (and spam folder)
4. Check concierge email inbox

### 3. Verify Email Content
- ✅ Concierge receives notification
- ✅ Guest receives confirmation
- ✅ All booking details are correct
- ✅ Dates and times are formatted correctly

---

## Important Notes

### Email Delivery
- ✅ Emails are sent **asynchronously** (fire-and-forget)
- ✅ Booking creation **does NOT wait** for email to send
- ✅ If email fails, booking is still created successfully
- ✅ Email errors are logged but don't affect booking creation

### Email Errors
If email fails:
- ❌ User still sees success message (booking is created)
- ❌ Error is logged in server console
- ❌ Booking is saved in database
- ✅ You can manually check bookings in dashboard

### Email Timing
- 📧 Emails are sent **immediately** after booking is created
- 📧 Both emails (concierge + guest) are sent in parallel
- 📧 No delay or queue system

---

## Troubleshooting

### Problem: No emails are being sent

**Check 1: Environment Variables**
```bash
# Check if .env file exists and has email config
cat .env | grep EMAIL
```

**Check 2: Server Logs**
Look for email configuration warnings in server console

**Check 3: Email Credentials**
- Verify EMAIL_USER and EMAIL_PASS are correct
- For Gmail, use App Password (not regular password)
- Check if 2FA is enabled (required for Gmail)

**Check 4: Firewall/Network**
- Ensure server can connect to SMTP server
- Check if port 587 or 465 is blocked

### Problem: Email errors in logs

**Common Issues:**
1. **Invalid credentials** → Check EMAIL_USER and EMAIL_PASS
2. **Wrong port** → Use 587 for TLS, 465 for SSL
3. **SMTP server blocked** → Check firewall settings
4. **App password expired** → Generate new app password (Gmail)

---

## Summary

### What Happens When "Confirm Booking" is Pressed:

1. ✅ **Frontend validates** all booking data
2. ✅ **API call** sends bookings to backend
3. ✅ **Backend validates** and saves to database
4. ✅ **Emails are sent** (if configured):
   - 📧 To concierge: `Tanasbeautyboost@gmail.com`
   - 📧 To guest: Guest's email address
5. ✅ **Success message** shown to user
6. ✅ **Bookings cleared** from UI

### Email Status:

**Currently:** Email functionality is **implemented** but requires configuration.

**To enable emails:**
1. Add email environment variables to `.env` file
2. Restart server
3. Test with a booking

**If emails are not configured:**
- Bookings still work ✅
- Bookings are saved to database ✅
- No emails are sent ⚠️
- Warning logged in server console ⚠️

---

## Next Steps

1. **Set up email configuration** (see instructions above)
2. **Test email delivery** with a test booking
3. **Monitor server logs** for email errors
4. **Check spam folders** if emails don't arrive

The booking system is fully functional - emails just need to be configured! 🎉

