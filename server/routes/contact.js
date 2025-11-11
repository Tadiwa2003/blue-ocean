import express from 'express';
import rateLimit from 'express-rate-limit';
import { createContactMessage, getContactMessages } from '../controllers/contactController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';
import { validateContactForm } from '../middleware/validation.js';

const router = express.Router();

// Rate limiting for contact form (15 minutes, 5 requests)
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public route - anyone can submit contact form (with rate limiting and validation)
router.post('/', contactRateLimiter, validateContactForm, createContactMessage);

// Admin route - view contact messages
router.get('/', authenticateToken, requireRole('admin', 'owner'), getContactMessages);

export default router;

