import express from 'express';
import { createContactMessage, getContactMessages } from '../controllers/contactController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', createContactMessage);

// Admin route - view contact messages
router.get('/', authenticateToken, requireRole('admin', 'owner'), getContactMessages);

export default router;

