// Import products data
import { products as productsData } from '../data/productsData.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/productsData.js');

// Helper function to save products to file
async function saveProducts(products) {
  const content = `// Products data - imported from frontend
// This file contains the products array

export const products = ${JSON.stringify(products, null, 2)};
`;
  await fs.writeFile(productsFilePath, content, 'utf8');
}

// Get all products
export const getProducts = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        products: productsData,
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
    const product = productsData.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: {
        product,
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

    // Validation
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required.',
      });
    }

    // Generate ID from name
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if product with same ID already exists
    if (productsData.find(p => p.id === id)) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists.',
      });
    }

    const newProduct = {
      id,
      name,
      category,
      price,
      image: image || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
      description: description || '',
      badges: badges || [],
    };

    // Add to products array
    productsData.push(newProduct);

    // Save to file
    await saveProducts(productsData);

    res.status(201).json({
      success: true,
      data: {
        product: newProduct,
      },
      message: 'Product created successfully.',
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product.',
    });
  }
};

