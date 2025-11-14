import express from 'express';
import { 
  createBookings, 
  getBookings, 
  getUserBookings, 
  getBookingById, 
  updateBookingStatus 
} from '../controllers/bookingController.js';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create bookings - allow both authenticated and guest bookings
router.post('/', optionalAuth, createBookings);

// All other routes require authentication
router.use(authenticateToken);

// Get user's own bookings
router.get('/my-bookings', getUserBookings);

// Get all bookings (admin/owner only)
router.get('/', requireRole('admin', 'owner'), getBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Update booking status
router.patch('/:id/status', updateBookingStatus);

export default router;

