import { getAllServices, getServiceById as getServiceByIdDB, createService as createServiceDB } from '../db/services.js';
import crypto from 'crypto';


// Get all services
export const getServices = async (req, res) => {
  try {
    // If user is authenticated, filter by role
    if (req.user) {
      const userRole = req.user.role;
      const userId = req.user.id;
      const isOwner = userRole === 'owner';
      
      // Owners see all services, regular users see ONLY their own (excludes platform services)
      const services = await getAllServices(userId, isOwner);
      
      return res.json({
        success: true,
        data: {
          services,
        },
      });
    }
    
    // Public access (for storefronts) - show all services
    const services = await getAllServices(null, false);
    res.json({
      success: true,
      data: {
        services,
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
    const service = await getServiceByIdDB(id);

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

    // Generate unique ID from name with UUID suffix
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const id = `${baseSlug}-${crypto.randomUUID().substring(0, 8)}`;

    // Associate service with user (owners can create platform services without userId)
    const userId = req.user?.role === 'owner' ? null : req.user?.id;
    
    // Create service in database
    const createdService = await createServiceDB({
      id,
      userId,
      name: name.trim(),
      serviceCategory,
      description: description || '',
      duration: duration || 60,
      basePrice: parseFloat(basePrice),
      currency: currency || 'USD',
      image: image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
      badges: badges || [],
    });

    res.status(201).json({
      success: true,
      data: {
        service: createdService,
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

