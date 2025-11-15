# Email Configuration Instructions

## Step 1: Create .env File

Create a file named `.env` in the `server/` directory with the following content:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SECURE=false
EMAIL_FROM=your-email@gmail.com
SPA_CONCIERGE_EMAIL=Tana'sbeautyboost@gmail.com
```

## Step 2: Get Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter a name like "Spa Booking System"
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

3. **Add to .env file:**
   - Replace `your-app-password` with the 16-character password (remove spaces)
   - Replace `your-email@gmail.com` with your actual Gmail address

## Step 3: Update .env File

Your `.env` file should look like this (with your actual credentials):

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youractualemail@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_SECURE=false
EMAIL_FROM=youractualemail@gmail.com
SPA_CONCIERGE_EMAIL=Tana'sbeautyboost@gmail.com
```

## Step 4: Restart Server

After creating/updating the `.env` file, restart your server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run server

# Or if using dev mode:
npm run dev:server
```

## Step 5: Test Email

1. Create a test booking
2. Confirm the booking
3. Check server console for email status:
   - ✅ `[Email] ✅ Concierge notification sent to: Tana'sbeautyboost@gmail.com`
   - ✅ `[Email] ✅ Guest confirmation sent to: [guest email]`
4. Check email inboxes:
   - Concierge: `Tana'sbeautyboost@gmail.com`
   - Guest: The email address used in the booking

## Email Addresses

- **Concierge Email:** `Tana'sbeautyboost@gmail.com` (receives all booking notifications)
- **Guest Email:** Guest's email from booking form (receives confirmation)

## Troubleshooting

### Problem: "Transporter not configured"
- ✅ Check that `.env` file exists in `server/` directory
- ✅ Check that all required variables are set
- ✅ Restart server after creating/updating `.env`

### Problem: "Authentication failed"
- ✅ Verify EMAIL_USER is correct
- ✅ Verify EMAIL_PASS is the App Password (not regular password)
- ✅ Make sure 2FA is enabled on Gmail account
- ✅ Regenerate App Password if needed

### Problem: "Connection timeout"
- ✅ Check internet connection
- ✅ Verify EMAIL_HOST is correct (smtp.gmail.com)
- ✅ Verify EMAIL_PORT is correct (587 for TLS)
- ✅ Check firewall settings

## Security Note

⚠️ **Never commit `.env` file to git!**
- The `.env` file contains sensitive credentials
- It should be in `.gitignore`
- Use `.env.example` as a template (without real passwords)

## Verification

After setup, when you confirm a booking, you should see in server console:

```
[Email] ✅ Concierge notification sent to: Tana'sbeautyboost@gmail.com
[Email] ✅ Guest confirmation sent to: guest@example.com
[Email] ✅ All booking notifications processed
```

If you see these messages, emails are working! 🎉

