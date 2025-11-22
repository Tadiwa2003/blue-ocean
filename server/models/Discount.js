import mongoose from 'mongoose';

/**
 * Discount Model - Shopify-style discount codes and promotions
 */
const discountSchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  
  // Discount type
  discountType: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y'],
    required: true,
  },
  
  // Discount value
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // For buy_x_get_y type
  buyXGetY: {
    buyQuantity: Number,
    getQuantity: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed_amount', 'free'],
    },
    discountValue: Number,
  },
  
  // Usage limits
  usageLimit: {
    type: Number,
    min: 0,
  },
  usageLimitPerCustomer: {
    type: Number,
    min: 0,
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Date range
  startsAt: {
    type: Date,
    required: true,
  },
  endsAt: {
    type: Date,
  },
  
  // Minimum requirements
  minimumOrderValue: {
    type: Number,
    min: 0,
  },
  minimumQuantity: {
    type: Number,
    min: 0,
  },
  
  // Applicability
  appliesTo: {
    type: String,
    enum: ['all', 'products', 'collections'],
    default: 'all',
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductEnhanced',
  }],
  collectionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
  }],
  
  // Customer eligibility
  customerEligibility: {
    type: String,
    enum: ['all', 'specific_segments', 'specific_customers'],
    default: 'all',
  },
  customerSegments: [String],
  customerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  }],
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
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
discountSchema.index({ storeId: 1, code: 1 }, { unique: true });
discountSchema.index({ storeId: 1, status: 1 });
discountSchema.index({ code: 1 });
discountSchema.index({ startsAt: 1, endsAt: 1 });

// Pre-save middleware
discountSchema.pre('save', async function(next) {
  // Generate code if not provided
  if (!this.code && this.title) {
    this.code = this.title
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '')
      .substring(0, 20);
    
    // Ensure uniqueness
    let code = this.code;
    let counter = 0;
    const maxAttempts = 10;
    
    while (counter < maxAttempts) {
      const existing = await mongoose.model('Discount').findOne({
        code,
        storeId: this.storeId,
        _id: { $ne: this._id },
      });
      
      if (!existing) break;
      
      code = `${this.code}${counter + 1}`;
      counter++;
    }
    
    this.code = code;
  }
  
  // Update status based on dates
  const now = new Date();
  if (this.endsAt && this.endsAt < now) {
    this.status = 'expired';
  } else if (this.startsAt > now) {
    this.status = 'inactive';
  } else if (this.status !== 'expired') {
    this.status = 'active';
  }
  
  this.updatedAt = Date.now();
  next();
});

// Method to calculate discount amount
discountSchema.methods.calculateDiscount = function(orderTotal, orderItems = []) {
  // Check if discount is valid
  if (this.status !== 'active') {
    return { valid: false, reason: 'Discount is not active' };
  }
  
  const now = new Date();
  if (this.startsAt > now || (this.endsAt && this.endsAt < now)) {
    return { valid: false, reason: 'Discount is outside valid date range' };
  }
  
  // Check minimum order value
  if (this.minimumOrderValue && orderTotal < this.minimumOrderValue) {
    return { 
      valid: false, 
      reason: `Minimum order value of ${this.minimumOrderValue} required` 
    };
  }
  
  // Check minimum quantity
  if (this.minimumQuantity) {
    const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity < this.minimumQuantity) {
      return { 
        valid: false, 
        reason: `Minimum quantity of ${this.minimumQuantity} required` 
      };
    }
  }
  
  // Check usage limit
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, reason: 'Discount usage limit reached' };
  }
  
  // Calculate discount amount
  let discountAmount = 0;
  
  switch (this.discountType) {
    case 'percentage':
      discountAmount = (orderTotal * this.value) / 100;
      break;
    case 'fixed_amount':
      discountAmount = Math.min(this.value, orderTotal);
      break;
    case 'free_shipping':
      // This would be handled separately in shipping calculation
      discountAmount = 0;
      break;
    case 'buy_x_get_y':
      // Complex calculation based on buy_x_get_y rules
      discountAmount = 0; // Would need order items to calculate
      break;
  }
  
  return {
    valid: true,
    discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
    discountType: this.discountType,
  };
};

// Method to check if discount can be used by customer
discountSchema.methods.canBeUsedByCustomer = function(customerId, customerTags = []) {
  if (this.customerEligibility === 'all') {
    return true;
  }
  
  if (this.customerEligibility === 'specific_customers') {
    return this.customerIds.some(id => id.toString() === customerId?.toString());
  }
  
  if (this.customerEligibility === 'specific_segments') {
    return this.customerSegments.some(segment => customerTags.includes(segment));
  }
  
  return false;
};

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;

