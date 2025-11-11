# Quick Fix: Create MySQL User

## The Problem
Your `.env` file is configured to use user `blueocean`, but this user doesn't exist in MySQL yet.

## Quick Solution

**Run this command and enter your MySQL root password when prompted:**

```bash
mysql -u root -p <<EOF
CREATE USER IF NOT EXISTS 'blueocean'@'localhost' IDENTIFIED BY 'blueocean2024';
GRANT ALL PRIVILEGES ON blueocean.* TO 'blueocean'@'localhost';
CREATE DATABASE IF NOT EXISTS blueocean;
FLUSH PRIVILEGES;
SELECT 'User created successfully!' AS Status;
EOF
```

**Or use the interactive script:**

```bash
./setup-mysql-user.sh
```

## After Creating the User

Restart your server:
```bash
npm run server
```

You should now see:
```
✅ MySQL Connected: localhost:3306/blueocean
```

## Alternative: Use Root Instead

If you prefer to use root, update `.env`:
```env
DB_USER=root
DB_PASSWORD=your_root_password
```

Then restart the server.

