import { body, validationResult } from 'express-validator';

// Sign up validation middleware
export const validateSignUp = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email must be 255 characters or less'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

// Sign in validation middleware
export const validateSignIn = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

// Contact form validation middleware
export const validateContactForm = [
  // Support both single 'name' field or 'firstName'/'lastName' fields
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters')
    .escape(),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters')
    .escape(),
  body().custom((value) => {
    // At least one name format must be provided
    if (!value.name && (!value.firstName || !value.lastName)) {
      throw new Error('Either name or both firstName and lastName are required');
    }
    return true;
  }),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email must be 255 characters or less'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Message must be 5000 characters or less')
    .escape(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Phone must be 50 characters or less'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Company must be 200 characters or less')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

// Product validation middleware
const ALLOWED_CATEGORIES = ['Totes', 'Handbags', 'Shoulder Bags', 'Slides & Sandals', 'Clothing', 'Accessories'];

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 1, max: 200 }).withMessage('Product name must be between 1 and 200 characters')
    .escape(),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(ALLOWED_CATEGORIES).withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`),
  body('price')
    .notEmpty().withMessage('Price is required')
    .custom((value) => {
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : parseFloat(value);
      if (!Number.isFinite(numValue) || numValue <= 0) {
        throw new Error('Price must be a positive number');
      }
      return true;
    }),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be 2000 characters or less')
    .escape(),
  body('image')
    .optional()
    .trim()
    .isURL().withMessage('Image must be a valid URL')
    .matches(/^https?:\/\//).withMessage('Image URL must use HTTP or HTTPS'),
  body('badges')
    .optional()
    .isArray().withMessage('Badges must be an array')
    .custom((badges) => {
      if (badges.length > 10) {
        throw new Error('Maximum 10 badges allowed');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

// Service validation middleware
const ALLOWED_SERVICE_CATEGORIES = ['Massage', 'Facial', 'Body Treatment', 'Wellness', 'Spa Package'];

export const validateService = [
  body('name')
    .trim()
    .notEmpty().withMessage('Service name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Service name must be between 2 and 200 characters')
    .escape(),
  body('serviceCategory')
    .trim()
    .notEmpty().withMessage('Service category is required')
    .isIn(ALLOWED_SERVICE_CATEGORIES).withMessage(`Service category must be one of: ${ALLOWED_SERVICE_CATEGORIES.join(', ')}`),
  body('basePrice')
    .notEmpty().withMessage('Base price is required')
    .custom((value) => {
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : parseFloat(value);
      if (!Number.isFinite(numValue) || numValue <= 0) {
        throw new Error('Base price must be a positive number');
      }
      return true;
    }),
  body('duration')
    .optional()
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer (minutes)'),
  body('currency')
    .optional()
    .trim()
    .isIn(['USD', 'EUR', 'GBP']).withMessage('Currency must be USD, EUR, or GBP'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be 2000 characters or less')
    .escape(),
  body('image')
    .optional()
    .trim()
    .isURL().withMessage('Image must be a valid URL')
    .matches(/^https?:\/\//).withMessage('Image URL must use HTTP or HTTPS'),
  body('badges')
    .optional()
    .isArray().withMessage('Badges must be an array')
    .custom((badges) => {
      if (badges.length > 10) {
        throw new Error('Maximum 10 badges allowed');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];
