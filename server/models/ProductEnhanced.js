import mongoose from 'mongoose';

/**
 * Enhanced Product Model - Shopify-style with variants, inventory, and collections
 */
const variantSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  compareAtPrice: {
    type: Number,
    min: 0,
  },
  sku: {
    type: String,
    trim: true,
    sparse: true, // Allow null but enforce uniqueness when present
  },
  barcode: {
    type: String,
    trim: true,
  },
  inventoryQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  inventoryPolicy: {
    type: String,
    enum: ['deny', 'continue'],
    default: 'deny', // 'deny' = don't allow purchase when out of stock, 'continue' = allow backorders
  },
  weight: {
    type: Number,
    min: 0,
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'g', 'lb', 'oz'],
    default: 'kg',
  },
  option1: String, // e.g., "Size: Large"
  option2: String, // e.g., "Color: Blue"
  option3: String,
  position: {
    type: Number,
    default: 0,
  },
  image: String, // Variant-specific image
}, {
  _id: true,
  timestamps: false,
});

const productOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  values: [{
    type: String,
    trim: true,
  }],
}, {
  _id: false,
});

const productSchema = new mongoose.Schema({
  // Store association
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storefront',
    required: true,
    index: true,
  },
  
  // Basic information
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  handle: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  
  // Product classification
  productType: {
    type: String,
    trim: true,
  },
  vendor: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
    index: true,
  },
  
  // Media
  images: [{
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
      default: 0,
    },
  }],
  
  // Variants
  variants: [variantSchema],
  
  // Options (for variant generation)
  options: [productOptionSchema],
  
  // SEO
  seo: {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  
  // Shipping
  shipping: {
    weight: {
      type: Number,
      min: 0,
    },
    weightUnit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz'],
      default: 'kg',
    },
    requiresShipping: {
      type: Boolean,
      default: true,
    },
  },
  
  // Legacy fields for backward compatibility
  name: String, // Maps to title
  category: String, // Maps to productType
  price: Number, // Maps to first variant price
  image: String, // Maps to first image
  
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

// Indexes for performance
productSchema.index({ storeId: 1, handle: 1 }, { unique: true });
productSchema.index({ storeId: 1, status: 1 });
productSchema.index({ storeId: 1, createdAt: -1 });
productSchema.index({ storeId: 1, productType: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'variants.sku': 1 }, { sparse: true });

// Virtual for total inventory
productSchema.virtual('totalInventory').get(function() {
  return this.variants.reduce((sum, variant) => sum + (variant.inventoryQuantity || 0), 0);
});

// Pre-save middleware
productSchema.pre('save', async function(next) {
  // Generate handle from title if not provided
  if (!this.handle && this.title) {
    this.handle = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Ensure uniqueness
    let handle = this.handle;
    let counter = 0;
    const maxAttempts = 10;
    
    while (counter < maxAttempts) {
      const existing = await mongoose.model('ProductEnhanced').findOne({
        handle,
        storeId: this.storeId,
        _id: { $ne: this._id },
      });
      
      if (!existing) break;
      
      handle = `${this.handle}-${counter + 1}`;
      counter++;
    }
    
    this.handle = handle;
  }
  
  // Backward compatibility: sync legacy fields
  if (this.title && !this.name) {
    this.name = this.title;
  }
  if (this.productType && !this.category) {
    this.category = this.productType;
  }
  if (this.variants && this.variants.length > 0 && !this.price) {
    this.price = this.variants[0].price;
  }
  if (this.images && this.images.length > 0 && !this.image) {
    this.image = this.images[0].url;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function(variantId = null) {
  if (variantId) {
    const variant = this.variants.id(variantId);
    if (!variant) return false;
    if (variant.inventoryPolicy === 'continue') return true;
    return variant.inventoryQuantity > 0;
  }
  
  // Check if any variant is in stock
  return this.variants.some(variant => {
    if (variant.inventoryPolicy === 'continue') return true;
    return variant.inventoryQuantity > 0;
  });
};

// Method to decrease inventory
productSchema.methods.decreaseInventory = function(variantId, quantity) {
  const variant = this.variants.id(variantId);
  if (!variant) {
    throw new Error('Variant not found');
  }
  
  if (variant.inventoryPolicy === 'deny' && variant.inventoryQuantity < quantity) {
    throw new Error('Insufficient inventory');
  }
  
  variant.inventoryQuantity = Math.max(0, variant.inventoryQuantity - quantity);
  return this.save();
};

// Method to increase inventory
productSchema.methods.increaseInventory = function(variantId, quantity) {
  const variant = this.variants.id(variantId);
  if (!variant) {
    throw new Error('Variant not found');
  }
  
  variant.inventoryQuantity = (variant.inventoryQuantity || 0) + quantity;
  return this.save();
};

const ProductEnhanced = mongoose.model('ProductEnhanced', productSchema);

export default ProductEnhanced;

