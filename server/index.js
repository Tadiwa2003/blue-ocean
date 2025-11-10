import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB, getConnectionStatus } from './db/connection.js';
import { trackMetrics, getMetrics } from './middleware/metrics.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';
import productRoutes from './routes/products.js';
import serviceRoutes from './routes/services.js';
import subscriptionRoutes from './routes/subscriptions.js';
import bookingRoutes from './routes/bookings.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware - CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Development override: allow all origins if ALLOW_ALL_CORS is set
    if (process.env.ALLOW_ALL_CORS === 'true') {
      return callback(null, true);
    }
    
    // Allow requests from frontend URL or any localhost port
    if (origin === FRONTEND_URL || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Deny all other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours - cache preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Metrics tracking middleware (must be before routes)
app.use(trackMetrics);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Blue Ocean API is running',
    timestamp: new Date().toISOString(),
    database: getConnectionStatus() ? 'connected' : 'disconnected',
  });
});

// Metrics endpoint
app.get('/api/metrics', getMetrics);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB (non-blocking - server will start even if DB fails)
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Blue Ocean API server running on http://localhost:${PORT}`);
      console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: ${getConnectionStatus() ? 'MongoDB Connected' : 'MongoDB Not Connected'}`);
      console.log(`\n✅ Server ready! CORS configured for: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

