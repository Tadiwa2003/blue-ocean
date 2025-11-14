# 🚀 Quick Email Setup - Do This Now!

## Create .env File

**Location:** Create a file named `.env` in the `server/` directory

**Full path:** `/Users/tadiwachoga/marketplace for Kim /server/.env`

## Copy This Template

Open a text editor and create the `.env` file with this content:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SECURE=false
EMAIL_FROM=your-email@gmail.com
SPA_CONCIERGE_EMAIL=Tana'sbeautyboost@gmail.com
```

## Replace These Values

1. **EMAIL_USER**: Your Gmail address (e.g., `youremail@gmail.com`)
2. **EMAIL_PASS**: Your Gmail App Password (16 characters, no spaces)
3. **EMAIL_FROM**: Same as EMAIL_USER (or your preferred from address)

## Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Select "Mail" and "Other (Custom name)"
4. Enter name: "Spa Booking System"
5. Click "Generate"
6. Copy the 16-character password (remove spaces)
7. Paste it in `.env` file as `EMAIL_PASS`

## Example .env File

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=myemail@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_SECURE=false
EMAIL_FROM=myemail@gmail.com
SPA_CONCIERGE_EMAIL=Tana'sbeautyboost@gmail.com
```

## After Creating .env File

1. **Save the file** in `server/.env`
2. **Restart your server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run server
   ```
3. **Check server console** - you should see:
   ```
   [Email] ✅ Email transporter configured successfully
   [Email] 📧 Concierge email: Tana'sbeautyboost@gmail.com
   ```

## Test It

1. Create a booking
2. Confirm the booking
3. Check server console for:
   ```
   [Email] ✅ Concierge notification sent to: Tana'sbeautyboost@gmail.com
   [Email] ✅ Guest confirmation sent to: [guest email]
   ```
4. Check email inboxes!

## Important Notes

- ✅ `.env` file should be in `server/` directory (same folder as `index.js`)
- ✅ Never commit `.env` to git (it contains passwords)
- ✅ Restart server after creating/updating `.env`
- ✅ Use App Password, not your regular Gmail password

## Email Addresses

- **Concierge:** `Tana'sbeautyboost@gmail.com` (receives all booking notifications)
- **Guest:** Guest's email from booking form (receives confirmation)

---

**Once you create the `.env` file and restart the server, emails will work automatically!** 🎉

