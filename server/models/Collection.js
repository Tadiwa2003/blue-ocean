import mongoose from 'mongoose';

/**
 * Collection Model - Shopify-style product collections
 */
const collectionRuleSchema = new mongoose.Schema({
  column: {
    type: String,
    enum: ['tag', 'title', 'type', 'vendor', 'variant_price', 'weight', 'inventory_stock'],
    required: true,
  },
  relation: {
    type: String,
    enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'starts_with', 'ends_with', 'contains', 'not_contains'],
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
}, {
  _id: false,
});

const collectionSchema = new mongoose.Schema({
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
  handle: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
  },
  
  // Collection type
  type: {
    type: String,
    enum: ['manual', 'automatic', 'smart'],
    default: 'manual',
  },
  
  // Smart collection rules (for automatic/smart collections)
  rules: [collectionRuleSchema],
  
  // Manual collection products
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductEnhanced',
  }],
  
  // Sort order
  sortOrder: {
    type: String,
    enum: ['manual', 'best-selling', 'title-asc', 'title-desc', 'price-asc', 'price-desc', 'created-asc', 'created-desc'],
    default: 'manual',
  },
  
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
  
  // Status
  published: {
    type: Boolean,
    default: true,
  },
  
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
collectionSchema.index({ storeId: 1, handle: 1 }, { unique: true });
collectionSchema.index({ storeId: 1, type: 1 });
collectionSchema.index({ storeId: 1, published: 1 });

// Pre-save middleware
collectionSchema.pre('save', async function(next) {
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
      const existing = await mongoose.model('Collection').findOne({
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
  
  this.updatedAt = Date.now();
  next();
});

// Method to get products for smart/automatic collections
collectionSchema.methods.getProducts = async function() {
  if (this.type === 'manual') {
    const ProductEnhanced = mongoose.model('ProductEnhanced');
    return await ProductEnhanced.find({
      _id: { $in: this.products },
      storeId: this.storeId,
      status: 'active',
    });
  }
  
  // For automatic/smart collections, apply rules
  if (this.type === 'automatic' || this.type === 'smart') {
    const ProductEnhanced = mongoose.model('ProductEnhanced');
    let query = { storeId: this.storeId, status: 'active' };
    
    // Build query from rules
    this.rules.forEach(rule => {
      switch (rule.column) {
        case 'tag':
          if (rule.relation === 'equals') {
            query.tags = rule.condition;
          } else if (rule.relation === 'contains') {
            query.tags = { $in: [rule.condition] };
          }
          break;
        case 'title':
          if (rule.relation === 'contains') {
            query.title = { $regex: rule.condition, $options: 'i' };
          } else if (rule.relation === 'starts_with') {
            query.title = { $regex: `^${rule.condition}`, $options: 'i' };
          }
          break;
        case 'type':
          if (rule.relation === 'equals') {
            query.productType = rule.condition;
          }
          break;
        case 'vendor':
          if (rule.relation === 'equals') {
            query.vendor = rule.condition;
          }
          break;
        case 'variant_price':
          const price = parseFloat(rule.condition);
          if (rule.relation === 'greater_than') {
            query['variants.price'] = { $gt: price };
          } else if (rule.relation === 'less_than') {
            query['variants.price'] = { $lt: price };
          }
          break;
      }
    });
    
    let products = await ProductEnhanced.find(query);
    
    // Apply sort order
    if (this.sortOrder !== 'manual') {
      products = this.sortProducts(products);
    }
    
    return products;
  }
  
  return [];
};

// Method to sort products
collectionSchema.methods.sortProducts = function(products) {
  switch (this.sortOrder) {
    case 'title-asc':
      return products.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return products.sort((a, b) => b.title.localeCompare(a.title));
    case 'price-asc':
      return products.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        return priceA - priceB;
      });
    case 'price-desc':
      return products.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        return priceB - priceA;
      });
    case 'created-asc':
      return products.sort((a, b) => a.createdAt - b.createdAt);
    case 'created-desc':
      return products.sort((a, b) => b.createdAt - a.createdAt);
    default:
      return products;
  }
};

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;

