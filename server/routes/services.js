import express from 'express';
import { getServices, getServiceById, createService } from '../controllers/serviceController.js';
import { optionalAuth, authenticateToken, requireRole } from '../middleware/auth.js';
import { validateService } from '../middleware/validation.js';

const router = express.Router();

// Optional authentication - if authenticated, filters by user; if not, shows all (for public storefronts)
router.get('/', optionalAuth, getServices);

router.get('/:id', getServiceById);

// Protected routes - authenticated users can create services
router.post('/', authenticateToken, validateService, createService);

export default router;

