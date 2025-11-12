import { getAllProducts, getProductById as getProductByIdDB, createProduct as createProductDB, updateProduct as updateProductDB, deleteProduct as deleteProductDB } from '../db/products.js';
import crypto from 'crypto';

// Allowed product categories
const ALLOWED_CATEGORIES = ['Totes', 'Handbags', 'Shoulder Bags', 'Slides & Sandals', 'Clothing', 'Accessories'];

// Maximum lengths for validation
const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

// Load products from JSON file (preferred) or fallback to JS module
let productsData = [];
async function loadProducts() {
  try {
    // Try to load from JSON first
    const jsonData = await fs.readFile(productsJsonPath, 'utf8');
    productsData = JSON.parse(jsonData);
  } catch (error) {
    // Fallback to JS module if JSON doesn't exist
    try {
      const { products } = await import('../data/productsData.js');
      productsData = products || [];
    } catch (importError) {
      console.error('Error loading products:', importError);
      productsData = [];
    }
  }
}

// Initialize products on module load
await loadProducts();

// Helper function to sanitize HTML and prevent XSS
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Helper function to validate URL
function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}


// Get all products
export const getProducts = async (req, res) => {
  try {
    // If user is authenticated, filter by role
    if (req.user) {
      const userRole = req.user.role;
      const userId = req.user.id;
      const isOwner = userRole === 'owner';
      
      // Owners see all products, regular users see ONLY their own (excludes platform products)
      const products = await getAllProducts(userId, isOwner);
      const formattedProducts = products.map((product) => ({
        ...product,
        price: typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price,
      }));
      
      return res.json({
        success: true,
        data: {
          products: formattedProducts,
        },
      });
    }
    
    // Public access (for storefronts) - show all products
    const products = await getAllProducts(null, false);
    const formattedProducts = products.map((product) => ({
      ...product,
      price: typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price,
    }));
    res.json({
      success: true,
      data: {
        products: formattedProducts,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products.',
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdDB(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Format price for frontend
    const formattedProduct = {
      ...product,
      price: typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price,
    };

    res.json({
      success: true,
      data: {
        product: formattedProduct,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product.',
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, image, description, badges } = req.body;

    // Validation: Required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required and must be a non-empty string.',
      });
    }

    if (!category || typeof category !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Product category is required.',
      });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      });
    }

    // Validate and parse price
    let parsedPrice;
    if (typeof price === 'string') {
      // Remove currency symbols and parse
      const cleanedPrice = price.replace(/[^0-9.]/g, '');
      parsedPrice = parseFloat(cleanedPrice);
    } else if (typeof price === 'number') {
      parsedPrice = price;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Price is required and must be a positive number.',
      });
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number.',
      });
    }

    // Validate name length
    const trimmedName = name.trim();
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Product name must be ${MAX_NAME_LENGTH} characters or less.`,
      });
    }

    // Validate description length
    const trimmedDescription = description ? description.trim() : '';
    if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Product description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`,
      });
    }

    // Validate image URL if provided
    if (image && !isValidUrl(image)) {
      return res.status(400).json({
        success: false,
        message: 'Image must be a valid HTTP or HTTPS URL.',
      });
    }

    // Validate badges
    let validatedBadges = [];
    if (badges) {
      if (Array.isArray(badges)) {
        validatedBadges = badges
          .filter(b => typeof b === 'string' && b.trim().length > 0)
          .map(b => sanitizeString(b.trim()))
          .slice(0, 10); // Limit to 10 badges
      } else {
        return res.status(400).json({
          success: false,
          message: 'Badges must be an array of strings.',
        });
      }
    }

    // Generate unique ID from name with UUID suffix to prevent collisions
    const baseSlug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Generate unique ID
    const id = `${baseSlug}-${crypto.randomUUID().substring(0, 8)}`;

    // Sanitize inputs
    const sanitizedName = sanitizeString(trimmedName);
    const sanitizedDescription = sanitizeString(trimmedDescription);

    // Associate product with user (owners can create platform products without userId)
    const userId = req.user?.role === 'owner' ? null : req.user?.id;
    
    const newProduct = await createProductDB({
      id,
      userId,
      name: sanitizedName,
      category,
      price: parsedPrice, // Store as number in DB
      image: image && isValidUrl(image) ? image : 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
      description: sanitizedDescription,
      badges: validatedBadges,
    });
    
    // Format price for response (to match frontend expectation)
    const formattedProduct = {
      ...newProduct,
      price: `$${newProduct.price.toFixed(2)}`,
    };

    res.status(201).json({
      success: true,
      data: {
        product: formattedProduct,
      },
      message: 'Product created successfully.',
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product.',
    });
  }
};

