import App from '../models/App.js';

/**
 * Middleware to authenticate app API requests
 */
export const authenticateApp = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key required',
      });
    }
    
    const app = await App.findOne({ apiKey, status: 'active' });
    
    if (!app) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key',
      });
    }
    
    // Attach app to request
    req.app = app;
    req.storeId = app.storeId;
    
    // Update last used timestamp
    app.lastUsedAt = new Date();
    await app.save();
    
    next();
  } catch (error) {
    console.error('App authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

/**
 * Middleware to check app permissions
 */
export const checkAppPermission = (resource, access) => {
  return (req, res, next) => {
    if (!req.app) {
      return res.status(401).json({
        success: false,
        message: 'App not authenticated',
      });
    }
    
    if (!req.app.hasPermission(resource, access)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${access} access to ${resource} required`,
      });
    }
    
    next();
  };
};

