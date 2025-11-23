import mongoose from 'mongoose';

/**
 * Review Model - Product reviews with ratings
 */
const reviewSchema = new mongoose.Schema({
  // Store association
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storefront',
    required: true,
    index: true,
  },
  
  // Product
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductEnhanced',
    required: true,
    index: true,
  },
  
  // Customer
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    index: true,
  },
  
  // Order (for verified purchase)
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderEnhanced',
    index: true,
  },
  
  // Review content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  images: [{
    type: String,
  }],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true,
  },
  
  // Verified purchase
  verifiedPurchase: {
    type: Boolean,
    default: false,
  },
  
  // Helpfulness
  helpfulCount: {
    type: Number,
    default: 0,
  },
  helpfulVotes: [{
    customerId: mongoose.Schema.Types.ObjectId,
    helpful: Boolean,
  }],
  
  // Merchant reply
  merchantReply: {
    message: String,
    repliedAt: Date,
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
reviewSchema.index({ productId: 1, status: 1 });
reviewSchema.index({ storeId: 1, status: 1 });
reviewSchema.index({ customerId: 1 });
reviewSchema.index({ rating: 1 });

// Method to mark as helpful
reviewSchema.methods.markHelpful = function(customerId, helpful) {
  const existingVote = this.helpfulVotes.find(
    vote => vote.customerId.toString() === customerId.toString()
  );
  
  if (existingVote) {
    if (existingVote.helpful !== helpful) {
      existingVote.helpful = helpful;
      this.helpfulCount += helpful ? 2 : -2;
    }
  } else {
    this.helpfulVotes.push({ customerId, helpful });
    this.helpfulCount += helpful ? 1 : -1;
  }
  
  return this.save();
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;

