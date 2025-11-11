import express from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/productController.js';
import { optionalAuth, authenticateToken, requireRole } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();

// Optional authentication - if authenticated, filters by user; if not, shows all (for public storefronts)
router.get('/', optionalAuth, getProducts);

// Protected routes - authenticated users can create products (must come before /:id route)
router.post('/', authenticateToken, validateProduct, createProduct);

// Public routes - must come after POST route
router.get('/:id', getProductById);

export default router;

