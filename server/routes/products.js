import express from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/productController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getProducts);

// Protected routes - owner only (must come before /:id route)
router.post('/', authenticateToken, requireRole('owner'), validateProduct, createProduct);

// Public routes - must come after POST route
router.get('/:id', getProductById);

export default router;

