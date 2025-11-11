import mongoose from 'mongoose';

const storefrontSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['products', 'spa', 'mixed'],
    required: true,
    default: 'products',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  // Design customization
  design: {
    hero: {
      backgroundImage: String,
      backgroundColor: String,
      title: String,
      subtitle: String,
      showLogo: { type: Boolean, default: true },
      logoSize: { type: String, default: 'medium' }, // small, medium, large
    },
    colors: {
      primary: { type: String, default: '#1da0e6' },
      secondary: { type: String, default: '#0b233e' },
      accent: { type: String, default: '#ffffff' },
    },
    layout: {
      productCardStyle: { type: String, default: 'modern' }, // modern, classic, minimal
      gridColumns: { type: Number, default: 4 },
    },
    branding: {
      storeName: String,
      tagline: String,
      logo: String,
    },
  },
  // Content settings
  settings: {
    showCategories: { type: Boolean, default: true },
    showSearch: { type: Boolean, default: true },
    showCart: { type: Boolean, default: true },
    enableCheckout: { type: Boolean, default: true },
  },
  // SEO and sharing
  seo: {
    title: String,
    description: String,
    keywords: [String],
  },
  // Status
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
  // URL slug for sharing
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

// Indexes
storefrontSchema.index({ userId: 1, type: 1 });
storefrontSchema.index({ slug: 1 });
storefrontSchema.index({ isPublished: 1 });

// Generate slug before saving
storefrontSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

const Storefront = mongoose.model('Storefront', storefrontSchema);

export default Storefront;

