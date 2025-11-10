import express from 'express';
import { getServices, getServiceById, createService } from '../controllers/serviceController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateService } from '../middleware/validation.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getServices);
router.get('/:id', getServiceById);

// Protected routes - owner only
router.post('/', authenticateToken, requireRole('owner'), validateService, createService);

export default router;

