import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button.jsx';
import { X, Package, DollarSign, Image as ImageIcon, Tag, FileText } from 'lucide-react';
import api from '../services/api.js';

const PRODUCT_CATEGORIES = [
  'Totes',
  'Handbags',
  'Slides & Sandals',
  'Shoulder Bags',
  'Clothing',
  'Accessories',
  'Jewelry',
];

export function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    badges: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        category: '',
        price: '',
        image: '',
        description: '',
        badges: '',
      });
      setError('');
    }
  }, [isOpen]);

  // GSAP animations
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const form = formRef.current;

    // Entrance animation
    gsap.fromTo(
      container,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
      }
    );

    // Form fields animation
    if (form) {
      const fields = form.querySelectorAll('input, select, textarea');
      gsap.fromTo(
        fields,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.05,
          delay: 0.2,
        }
      );
    }

    return () => {
      gsap.killTweensOf([container, form]);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      setError('Name, category, and price are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: formData.price.trim(),
        image: formData.image.trim() || undefined,
        description: formData.description.trim() || undefined,
        badges: formData.badges
          ? formData.badges.split(',').map((b) => b.trim()).filter(Boolean)
          : [],
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🛍️ Creating product:', productData);
        console.log('🔑 Auth token present:', !!localStorage.getItem('authToken'));
      }
      
      const response = await api.products.createProduct(productData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🛍️ Create product response:', response);
      }

      if (response.success) {
        console.log('✅ Product created successfully:', response.data.product);
        // Show success message briefly before closing
        setError(''); // Clear any errors
        if (onSuccess) {
          onSuccess(response.data.product);
        }
        // Small delay to show success state
        setTimeout(() => {
          onClose();
        }, 300);
      } else {
        setError(response.message || 'Failed to create product.');
      }
    } catch (err) {
      console.error('❌ Create product error:', err);
      setError(err.message || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-midnight/98 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-ocean/95 to-midnight/98 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 border border-brand-400/30">
              <Package className="h-6 w-6 text-brand-200" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-white">Add New Product</h2>
              <p className="text-sm text-white/60 mt-1">Create a new product for your storefront</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/20 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Product Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
                placeholder="e.g., Structured Panel Tote"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white focus:border-brand-400/50 focus:bg-white/10 outline-none transition appearance-none cursor-pointer"
                required
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-midnight">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Price <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
                placeholder="e.g., $85"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
            {formData.image && (
              <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 h-5 w-5 text-white/40" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition resize-none"
                placeholder="Describe your product..."
              />
            </div>
          </div>

          {/* Badges */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Badges (comma-separated)
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                name="badges"
                value={formData.badges}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
                placeholder="e.g., New stock, Best seller, Restocked"
              />
            </div>
            <p className="mt-2 text-xs text-white/50">Separate multiple badges with commas</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 border-white/20"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

