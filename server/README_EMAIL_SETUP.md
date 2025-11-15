# 📧 Email Setup - Quick Start

## ✅ .env File Created!

I've created a `.env` file template in the `server/` directory.

## 🔧 What You Need to Do

### Step 1: Edit the .env File

Open `server/.env` and replace these values:

```env
EMAIL_USER=your-email@gmail.com          ← Replace with YOUR Gmail address
EMAIL_PASS=your-app-password             ← Replace with YOUR Gmail App Password
EMAIL_FROM=your-email@gmail.com          ← Replace with YOUR Gmail address
```

### Step 2: Get Gmail App Password

1. **Enable 2-Factor Authentication** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as device
   - Enter name: "Spa Booking System"
   - Click "Generate"
   - **Copy the 16-character password** (remove spaces)

3. **Update .env file**:
   - Replace `your-app-password` with the 16-character password
   - Replace `your-email@gmail.com` with your actual Gmail

### Step 3: Restart Server

After updating `.env`, restart your server:

```bash
# Stop server (Ctrl+C)
npm run server
```

### Step 4: Verify

When server starts, you should see:
```
[Email] ✅ Email transporter configured successfully
[Email] 📧 Concierge email: tadiwachoga2003@gmail.com
[Email] 📧 From address: your-email@gmail.com
```

## 📧 Email Addresses

- **Concierge Email:** `tadiwachoga2003@gmail.com` (already configured ✅)
- **Guest Email:** Guest's email from booking form

## ✅ Testing

1. Create a test booking
2. Confirm the booking
3. Check server console for:
   ```
   [Email] ✅ Concierge notification sent to: tadiwachoga2003@gmail.com
   [Email] ✅ Guest confirmation sent to: [guest email]
   ```
4. Check email inboxes!

## 🎯 Current Status

- ✅ `.env` file created
- ✅ Email system configured
- ✅ Concierge email set to: `tadiwachoga2003@gmail.com`
- ⚠️ **You need to:** Add your Gmail credentials to `.env` file

Once you add your email credentials and restart the server, emails will work! 🎉

