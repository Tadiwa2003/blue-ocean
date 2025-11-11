# IMMEDIATE FIX - Run This Now!

## Quick Solution (Choose One)

### Option 1: Automated Script (Recommended)
```bash
node create-mysql-user.js
```
Enter your MySQL root password when prompted.

### Option 2: One-Line Command
Replace `YOUR_ROOT_PASSWORD` with your actual MySQL root password:

```bash
mysql -u root -pYOUR_ROOT_PASSWORD -e "CREATE USER IF NOT EXISTS 'blueocean'@'localhost' IDENTIFIED BY 'blueocean2024'; GRANT ALL PRIVILEGES ON blueocean.* TO 'blueocean'@'localhost'; CREATE DATABASE IF NOT EXISTS blueocean; FLUSH PRIVILEGES;"
```

### Option 3: Interactive MySQL
```bash
mysql -u root -p
```
Then paste these commands:
```sql
CREATE USER IF NOT EXISTS 'blueocean'@'localhost' IDENTIFIED BY 'blueocean2024';
GRANT ALL PRIVILEGES ON blueocean.* TO 'blueocean'@'localhost';
CREATE DATABASE IF NOT EXISTS blueocean;
FLUSH PRIVILEGES;
EXIT;
```

## After Creating User

Restart your server:
```bash
npm run server
```

You should see:
```
✅ MySQL Connected: localhost:3306/blueocean
✅ Database schema initialized
✅ Created default user: founder@blueocean.co
```

## Don't Know Your Root Password?

If you don't know your MySQL root password, you can:

1. **Reset MySQL root password** (macOS):
   ```bash
   brew services stop mysql
   mysqld_safe --skip-grant-tables &
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

2. **Or use root directly** - Update `.env`:
   ```env
   DB_USER=root
   DB_PASSWORD=your_root_password
   ```

