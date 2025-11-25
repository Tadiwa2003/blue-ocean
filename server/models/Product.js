import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: false, // Optional for backward compatibility with platform products
    index: true,
  },
  storefrontId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storefront',
    required: false, // Optional - null means platform product
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Totes', 'Handbags', 'Shoulder Bags', 'Slides & Sandals', 'Clothing', 'Accessories', 'Jewelry'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  badges: {
    type: [String],
    default: [],
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
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

// Indexes - remove duplicates (id, slug, userId, storefrontId already have indexes defined in schema)
productSchema.index({ category: 1 });
productSchema.index({ storefrontId: 1, category: 1 }); // Compound index for filtering

const Product = mongoose.model('Product', productSchema);

export default Product;

