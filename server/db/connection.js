import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeDefaultUsers } from './users.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blueocean';

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

export const getConnectionStatus = () => isConnected;

// Check if MongoDB is running
const checkMongoDBRunning = async () => {
  try {
    // Try to connect with a short timeout
    const testConnection = await mongoose.createConnection(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    await testConnection.close();
    return true;
  } catch (error) {
    return false;
  }
};

// Connect to MongoDB
export const connectDB = async () => {
  if (isConnected) {
    console.log('✅ MongoDB already connected');
    return;
  }

  try {
    // First check if MongoDB is running
    const mongoRunning = await checkMongoDBRunning();
    if (!mongoRunning) {
      console.error('❌ MongoDB is not running');
      console.error('💡 Start MongoDB with: brew services start mongodb-community');
      console.error('💡 Or run: ./start-everything.sh');
      isConnected = false;
      return;
    }

    // Connection options for better resilience
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(MONGODB_URI, options);

    isConnected = true;
    connectionAttempts = 0;
    console.log(`✅ MongoDB Connected: ${MONGODB_URI}`);

    // Initialize default users after successful connection
    try {
      await initializeDefaultUsers();
    } catch (error) {
      console.error('⚠️  Warning: Failed to initialize default users:', error.message);
    }

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    connectionAttempts++;
    console.error('❌ MongoDB connection error:', error.message);
    
    if (error.name === 'MongoServerSelectionError' || error.code === 'ECONNREFUSED') {
      console.error('⚠️  MongoDB is not running or not accessible');
      console.error('💡 Start MongoDB with: brew services start mongodb-community');
      console.error('💡 Or run: ./start-everything.sh');
    } else {
      console.error('⚠️  Server will continue without database connection');
      console.error('💡 Make sure MongoDB is running: brew services start mongodb-community');
    }
    
    isConnected = false;
    
    // Don't throw - allow server to start even without DB
    // The server will show "MongoDB Not Connected" status
  }
};

// Disconnect from database
export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
  }
};
