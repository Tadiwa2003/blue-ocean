import mongoose from 'mongoose';

/**
 * Customer Model - Shopify-style customer management
 */
const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['billing', 'shipping'],
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  address1: {
    type: String,
    required: true,
    trim: true,
  },
  address2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'US',
  },
  zip: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  _id: true,
  timestamps: false,
});

const customerSchema = new mongoose.Schema({
  // Store association
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storefront',
    required: true,
    index: true,
  },
  
  // Basic information
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  
  // Addresses
  addresses: [addressSchema],
  
  // Customer metadata
  tags: [{
    type: String,
    trim: true,
  }],
  
  // Statistics
  totalSpent: {
    type: Number,
    default: 0,
    min: 0,
  },
  orderCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  averageOrderValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Account status
  acceptsMarketing: {
    type: Boolean,
    default: false,
  },
  acceptsMarketingUpdatedAt: Date,
  
  // Notes
  note: {
    type: String,
    trim: true,
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
  lastOrderAt: Date,
}, {
  timestamps: true,
});

// Indexes
customerSchema.index({ storeId: 1, email: 1 }, { unique: true });
customerSchema.index({ storeId: 1, createdAt: -1 });
customerSchema.index({ storeId: 1, totalSpent: -1 });
customerSchema.index({ tags: 1 });

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.email;
});

// Method to update customer statistics
customerSchema.methods.updateStats = async function(orderTotal) {
  this.orderCount += 1;
  this.totalSpent += orderTotal;
  this.averageOrderValue = this.totalSpent / this.orderCount;
  this.lastOrderAt = new Date();
  return this.save();
};

// Method to add address
customerSchema.methods.addAddress = function(addressData) {
  // If this is the first address or marked as default, set it as default
  if (this.addresses.length === 0 || addressData.isDefault) {
    // Unset other default addresses of the same type
    this.addresses.forEach(addr => {
      if (addr.type === addressData.type) {
        addr.isDefault = false;
      }
    });
    addressData.isDefault = true;
  }
  
  this.addresses.push(addressData);
  return this.save();
};

// Method to get default address by type
customerSchema.methods.getDefaultAddress = function(type) {
  return this.addresses.find(addr => addr.type === type && addr.isDefault) ||
         this.addresses.find(addr => addr.type === type) ||
         null;
};

// Pre-save middleware
customerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;

