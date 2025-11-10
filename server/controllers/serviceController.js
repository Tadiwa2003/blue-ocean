// Import services data
import { services as servicesData } from '../data/servicesData.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const servicesFilePath = path.join(__dirname, '../data/servicesData.js');

// Helper function to save services to file
async function saveServices(services) {
  const content = `// Services data - imported from frontend
export const services = ${JSON.stringify(services, null, 2)};
`;
  await fs.writeFile(servicesFilePath, content, 'utf8');
}

// Get all services
export const getServices = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        services: servicesData,
      },
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services.',
    });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = servicesData.find(s => s.id === id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      data: {
        service,
      },
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service.',
    });
  }
};

// Create new service
export const createService = async (req, res) => {
  try {
    const {
      name,
      serviceCategory,
      duration,
      basePrice,
      currency,
      image,
      headline,
      description,
      badges,
    } = req.body;

    // Validation
    if (!name || !serviceCategory || !basePrice) {
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

    // Check if service with same ID already exists
    if (servicesData.find(s => s.id === id)) {
      return res.status(400).json({
        success: false,
        message: 'A service with this name already exists.',
      });
    }

    const newService = {
      id,
      name,
      serviceCategory,
      category: serviceCategory, // For compatibility
      duration: duration || 60,
      basePrice: parseFloat(basePrice),
      currency: currency || 'USD',
      price: `$${basePrice}`,
      image: image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
      headline: headline || description || '',
      description: description || '',
      badges: badges || [],
      tags: badges || [],
      gallery: image ? [image] : [],
      experienceHighlights: [],
      includes: [],
      benefits: [],
      bookableDates: [],
      timeSlots: [],
      addOns: [],
    };

    // Add to services array
    servicesData.push(newService);

    // Save to file
    await saveServices(servicesData);

    res.status(201).json({
      success: true,
      data: {
        service: newService,
      },
      message: 'Service created successfully.',
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service.',
    });
  }
};

