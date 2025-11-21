import mongoose from 'mongoose';

/**
 * App Model - Plugin/Extension system for third-party apps
 */
const appPermissionSchema = new mongoose.Schema({
  resource: {
    type: String,
    enum: ['products', 'orders', 'customers', 'collections', 'discounts', 'analytics'],
    required: true,
  },
  access: {
    type: String,
    enum: ['read', 'write', 'delete'],
    required: true,
  },
}, {
  _id: false,
});

const webhookSchema = new mongoose.Schema({
  event: {
    type: String,
    enum: [
      'order.created',
      'order.updated',
      'order.fulfilled',
      'product.created',
      'product.updated',
      'product.deleted',
      'customer.created',
      'customer.updated',
    ],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  secret: String,
  active: {
    type: Boolean,
    default: true,
  },
}, {
  _id: false,
});

const appSchema = new mongoose.Schema({
  // Store association
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storefront',
    required: true,
    index: true,
  },
  
  // App information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  version: {
    type: String,
    default: '1.0.0',
  },
  author: {
    type: String,
    trim: true,
  },
  
  // App credentials
  apiKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  apiSecret: {
    type: String,
    required: true,
  },
  
  // Permissions
  permissions: [appPermissionSchema],
  
  // Webhooks
  webhooks: [webhookSchema],
  
  // Settings
  settings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true,
  },
  
  // Installation
  installedAt: {
    type: Date,
    default: Date.now,
  },
  lastUsedAt: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
appSchema.index({ storeId: 1, status: 1 });
appSchema.index({ apiKey: 1 });

// Pre-save middleware
appSchema.pre('save', async function(next) {
  // Generate API key if not provided
  if (!this.apiKey) {
    const crypto = await import('crypto');
    this.apiKey = `app_${crypto.randomBytes(16).toString('hex')}`;
  }
  
  // Generate API secret if not provided
  if (!this.apiSecret) {
    const crypto = await import('crypto');
    this.apiSecret = crypto.randomBytes(32).toString('hex');
  }
  
  this.updatedAt = Date.now();
  next();
});

// Method to verify API key
appSchema.methods.verifyApiKey = function(apiKey) {
  return this.apiKey === apiKey && this.status === 'active';
};

// Method to check permission
appSchema.methods.hasPermission = function(resource, access) {
  return this.permissions.some(
    perm => perm.resource === resource && perm.access === access
  );
};

// Method to trigger webhook
appSchema.methods.triggerWebhook = async function(event, data) {
  const webhooks = this.webhooks.filter(
    wh => wh.event === event && wh.active
  );
  
  for (const webhook of webhooks) {
    try {
      // TODO: Implement webhook delivery
      console.log(`Triggering webhook ${webhook.url} for event ${event}`);
      // await fetch(webhook.url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Webhook-Signature': generateSignature(data, webhook.secret),
      //   },
      //   body: JSON.stringify(data),
      // });
    } catch (error) {
      console.error(`Webhook delivery failed: ${error.message}`);
    }
  }
};

const App = mongoose.model('App', appSchema);

export default App;

