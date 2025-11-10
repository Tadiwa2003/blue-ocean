import express from 'express';
import { 
  createBookings, 
  getBookings, 
  getUserBookings, 
  getBookingById, 
  updateBookingStatus 
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create bookings - allow both authenticated and guest bookings
router.post('/', async (req, res, next) => {
  // Try to authenticate if token exists, but don't fail if no token (for guest bookings)
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  // No auth header, continue without user (guest booking)
  next();
}, createBookings);

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

