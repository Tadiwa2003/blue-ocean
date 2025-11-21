import mongoose from 'mongoose';

/**
 * Enhanced Order Model - Shopify-style order management
 */
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductEnhanced',
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: true,
  },
  sku: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  compareAtPrice: Number,
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  variantTitle: String, // e.g., "Large / Blue"
  image: String,
}, {
  _id: true,
  timestamps: false,
});

const fulfillmentSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'open', 'success', 'cancelled', 'error'],
    default: 'pending',
  },
  trackingCompany: String,
  trackingNumber: String,
  trackingUrl: String,
  shippedAt: Date,
  estimatedDeliveryAt: Date,
  items: [{
    itemId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
  }],
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

const refundSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  reason: String,
  items: [{
    itemId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    amount: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

const orderSchema = new mongoose.Schema({
  // Store association
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storefront',
    required: true,
    index: true,
  },
  
  // Order identification
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  
  // Customer information
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    index: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  customerName: String,
  phone: String,
  
  // Order items
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  discountCode: String,
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  
  // Addresses
  shippingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    address1: String,
    address2: String,
    city: String,
    province: String,
    country: String,
    zip: String,
    phone: String,
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    address1: String,
    address2: String,
    city: String,
    province: String,
    country: String,
    zip: String,
    phone: String,
  },
  
  // Shipping
  shippingMethod: String,
  shippingRate: {
    name: String,
    price: Number,
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'authorized', 'paid', 'partially_paid', 'refunded', 'partially_refunded', 'voided'],
    default: 'pending',
  },
  paymentMethod: String,
  paymentGateway: String,
  transactionId: String,
  paidAt: Date,
  
  // Fulfillment
  fulfillmentStatus: {
    type: String,
    enum: ['unfulfilled', 'partial', 'fulfilled', 'restocked'],
    default: 'unfulfilled',
  },
  fulfillments: [fulfillmentSchema],
  
  // Refunds
  refunds: [refundSchema],
  refundTotal: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Order status
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true,
  },
  
  // Notes
  note: String,
  customerNote: String,
  
  // Cancellation
  cancelledAt: Date,
  cancelReason: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: Date,
}, {
  timestamps: true,
});

// Indexes
orderSchema.index({ storeId: 1, createdAt: -1 });
orderSchema.index({ storeId: 1, status: 1 });
orderSchema.index({ storeId: 1, customerId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ email: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ fulfillmentStatus: 1 });

// Pre-save middleware
orderSchema.pre('save', async function(next) {
  // Generate order number if not provided
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
    
    // Ensure uniqueness
    let orderNumber = this.orderNumber;
    let counter = 0;
    const maxAttempts = 10;
    
    while (counter < maxAttempts) {
      const existing = await mongoose.model('OrderEnhanced').findOne({ orderNumber });
      if (!existing) break;
      
      orderNumber = `ORD-${timestamp}-${random}${counter}`;
      counter++;
    }
    
    this.orderNumber = orderNumber;
  }
  
  // Calculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  
  // Update fulfillment status
  if (this.fulfillments && this.fulfillments.length > 0) {
    const fulfilledItems = this.fulfillments.reduce((sum, fulfillment) => {
      if (fulfillment.status === 'success') {
        return sum + fulfillment.items.reduce((s, item) => s + item.quantity, 0);
      }
      return sum;
    }, 0);
    
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (fulfilledItems === 0) {
      this.fulfillmentStatus = 'unfulfilled';
    } else if (fulfilledItems < totalItems) {
      this.fulfillmentStatus = 'partial';
    } else {
      this.fulfillmentStatus = 'fulfilled';
    }
  }
  
  // Update refund total
  this.refundTotal = this.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  
  // Update payment status based on refunds
  if (this.refundTotal > 0) {
    if (this.refundTotal >= this.total) {
      this.paymentStatus = 'refunded';
      this.status = 'refunded';
    } else {
      this.paymentStatus = 'partially_refunded';
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Method to add fulfillment
orderSchema.methods.addFulfillment = function(fulfillmentData) {
  this.fulfillments.push({
    ...fulfillmentData,
    status: 'open',
  });
  return this.save();
};

// Method to mark fulfillment as shipped
orderSchema.methods.markFulfilled = function(fulfillmentId, trackingData) {
  const fulfillment = this.fulfillments.id(fulfillmentId);
  if (!fulfillment) {
    throw new Error('Fulfillment not found');
  }
  
  fulfillment.status = 'success';
  fulfillment.shippedAt = new Date();
  if (trackingData) {
    fulfillment.trackingCompany = trackingData.company;
    fulfillment.trackingNumber = trackingData.number;
    fulfillment.trackingUrl = trackingData.url;
  }
  
  return this.save();
};

// Method to add refund
orderSchema.methods.addRefund = function(refundData) {
  this.refunds.push(refundData);
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancel = function(reason) {
  if (this.status === 'cancelled') {
    throw new Error('Order is already cancelled');
  }
  
  if (this.fulfillmentStatus === 'fulfilled') {
    throw new Error('Cannot cancel fulfilled order');
  }
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelReason = reason;
  
  return this.save();
};

const OrderEnhanced = mongoose.model('OrderEnhanced', orderSchema);

export default OrderEnhanced;

