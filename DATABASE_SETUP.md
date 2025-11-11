# MongoDB Database Setup

This application now uses **MongoDB** with Mongoose for data persistence.

## Prerequisites

1. **Install MongoDB**
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB**
   - **macOS**: `brew services start mongodb-community`
   - **Windows**: MongoDB should start automatically as a service
   - **Linux**: `sudo systemctl start mongod`

## Configuration

1. **Set MongoDB URI in `.env`**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blueocean
   ```

   For MongoDB Atlas (cloud):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blueocean
   ```

## Migration

To migrate existing JSON data to MongoDB:

```bash
npm run migrate
```

This will:
- Connect to MongoDB
- Import all existing data from JSON files
- Skip duplicates (safe to run multiple times)

## Database Models

The following models are available:

- **User** - User accounts and authentication
- **Product** - Product catalog
- **Service** - Spa services
- **Order** - Order records
- **Subscription** - Subscription data
- **Booking** - Spa bookings
- **Contact** - Contact form submissions

## Benefits

✅ **Concurrent Access** - Multiple users can access data simultaneously  
✅ **Better Performance** - Indexed queries for faster lookups  
✅ **Data Integrity** - Schema validation and relationships  
✅ **Scalability** - Can handle large datasets efficiently  
✅ **No File Locking** - No race conditions or file corruption issues  

## Troubleshooting

**Connection Error**: Make sure MongoDB is running
```bash
# Check MongoDB status
brew services list  # macOS
# or
sudo systemctl status mongod  # Linux
```

**Migration Issues**: The migration script is idempotent - you can run it multiple times safely.

**Port Already in Use**: Change the port in `MONGODB_URI` or stop the conflicting service.

