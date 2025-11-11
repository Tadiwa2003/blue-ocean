import * as storefrontDB from '../db/storefronts.js';
import { validationResult } from 'express-validator';

export async function getUserStorefronts(req, res) {
  try {
    const userId = req.user.id; // JWT token contains 'id' field
    const storefronts = await storefrontDB.getUserStorefronts(userId);
    res.json({
      success: true,
      data: { storefronts },
    });
  } catch (error) {
    console.error('Error fetching user storefronts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storefronts',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
}

export async function getStorefrontById(req, res) {
  try {
    const { id } = req.params;
    const storefront = await storefrontDB.getStorefrontById(id);
    
    if (!storefront) {
      return res.status(404).json({
        success: false,
        message: 'Storefront not found',
      });
    }

    // Check if user owns this storefront or if it's published
    const isOwner = storefront.userId && (
      (typeof storefront.userId.equals === 'function' && storefront.userId.equals(req.user.id)) ||
      String(storefront.userId) === String(req.user.id)
    );
    if (!isOwner && !storefront.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { storefront },
    });
  } catch (error) {
    console.error('Error fetching storefront:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storefront',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
}

export async function getStorefrontBySlug(req, res) {
  try {
    const { slug } = req.params;
    const storefront = await storefrontDB.getStorefrontBySlug(slug);
    
    if (!storefront) {
      return res.status(404).json({
        success: false,
        message: 'Storefront not found',
      });
    }

    // Only return published storefronts for public access
    if (!storefront.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Storefront not found',
      });
    }

    res.json({
      success: true,
      data: { storefront },
    });
  } catch (error) {
    console.error('Error fetching storefront by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storefront',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
}

export async function createStorefront(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const userId = req.user.id; // JWT token contains 'id' field
    
    // Prepare storefront data with defaults
    const storefrontData = {
      name: req.body.name.trim(),
      type: req.body.type,
      userId,
      design: {
        hero: {
          title: req.body.design?.hero?.title || '',
          subtitle: req.body.design?.hero?.subtitle || '',
          backgroundColor: req.body.design?.hero?.backgroundColor || '#0b233e',
          backgroundImage: req.body.design?.hero?.backgroundImage || '',
          showLogo: req.body.design?.hero?.showLogo !== undefined ? req.body.design.hero.showLogo : true,
          logoSize: req.body.design?.hero?.logoSize || 'medium',
        },
        colors: {
          primary: req.body.design?.colors?.primary || '#1da0e6',
          secondary: req.body.design?.colors?.secondary || '#0b233e',
          accent: req.body.design?.colors?.accent || '#ffffff',
        },
        layout: {
          productCardStyle: req.body.design?.layout?.productCardStyle || 'modern',
          gridColumns: req.body.design?.layout?.gridColumns || 4,
        },
        branding: {
          storeName: req.body.design?.branding?.storeName || '',
          tagline: req.body.design?.branding?.tagline || '',
          logo: req.body.design?.branding?.logo || '',
        },
      },
      settings: {
        showCategories: req.body.settings?.showCategories !== undefined ? req.body.settings.showCategories : true,
        showSearch: req.body.settings?.showSearch !== undefined ? req.body.settings.showSearch : true,
        showCart: req.body.settings?.showCart !== undefined ? req.body.settings.showCart : true,
        enableCheckout: req.body.settings?.enableCheckout !== undefined ? req.body.settings.enableCheckout : true,
      },
      isPublished: false,
    };

    const storefront = await storefrontDB.createStorefront(storefrontData);
    
    res.status(201).json({
      success: true,
      message: 'Storefront created successfully',
      data: { storefront },
    });
  } catch (error) {
    console.error('Error creating storefront:', error);
    
    // Handle duplicate key errors (e.g., duplicate slug)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A storefront with this name already exists. Please choose a different name.',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create storefront',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
}

export async function updateStorefront(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const userId = req.user.id; // JWT token contains 'id' field
    const updateData = req.body;

    const storefront = await storefrontDB.updateStorefront(id, userId, updateData);
    
    res.json({
      success: true,
      message: 'Storefront updated successfully',
      data: { storefront },
    });
  } catch (error) {
    console.error('Error updating storefront:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to update storefront',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
}

export async function deleteStorefront(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // JWT token contains 'id' field

    await storefrontDB.deleteStorefront(id, userId);
    
    res.json({
      success: true,
      message: 'Storefront deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting storefront:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to delete storefront',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
}

export async function publishStorefront(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // JWT token contains 'id' field

    const storefront = await storefrontDB.publishStorefront(id, userId);
    
    res.json({
      success: true,
      message: 'Storefront published successfully',
      data: { storefront },
    });
  } catch (error) {
    console.error('Error publishing storefront:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to publish storefront',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
}

export async function unpublishStorefront(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // JWT token contains 'id' field

    const storefront = await storefrontDB.unpublishStorefront(id, userId);
    
    res.json({
      success: true,
      message: 'Storefront unpublished successfully',
      data: { storefront },
    });
  } catch (error) {
    console.error('Error unpublishing storefront:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to unpublish storefront',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
}

