import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button.jsx';
import { X, Sparkles, DollarSign, Image as ImageIcon, Tag, FileText, Clock } from 'lucide-react';
import api from '../services/api.js';

const SERVICE_CATEGORIES = [
  'Facials',
  'Massages',
  'Body Treatments',
  'Manicures & Pedicures',
  'Hair Services',
  'Waxing',
  'Makeup',
  'Other',
];

export function AddServiceModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    serviceCategory: '',
    duration: '60',
    basePrice: '',
    currency: 'USD',
    image: '',
    headline: '',
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
        serviceCategory: '',
        duration: '60',
        basePrice: '',
        currency: 'USD',
        image: '',
        headline: '',
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
    if (!formData.name || !formData.serviceCategory || !formData.basePrice) {
      setError('Name, category, and price are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceData = {
        name: formData.name.trim(),
        serviceCategory: formData.serviceCategory,
        duration: parseInt(formData.duration) || 60,
        basePrice: parseFloat(formData.basePrice),
        currency: formData.currency,
        image: formData.image.trim() || undefined,
        headline: formData.headline.trim() || undefined,
        description: formData.description.trim() || undefined,
        badges: formData.badges
          ? formData.badges.split(',').map((b) => b.trim()).filter(Boolean)
          : [],
      };

      const response = await api.services.createService(serviceData);

      if (response.success) {
        if (onSuccess) {
          onSuccess(response.data.service);
        }
        onClose();
      } else {
        setError(response.message || 'Failed to create service.');
      }
    } catch (err) {
      console.error('Create service error:', err);
      setError(err.message || 'Failed to create service. Please try again.');
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30">
              <Sparkles className="h-6 w-6 text-purple-200" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-white">Add New Service</h2>
              <p className="text-sm text-white/60 mt-1">Create a new spa service for your storefront</p>
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

          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Service Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
                placeholder="e.g., Oceanstone Glow Facial"
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
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white focus:border-brand-400/50 focus:bg-white/10 outline-none transition appearance-none cursor-pointer"
                required
              >
                <option value="">Select a category</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-midnight">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration and Price */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Duration (minutes)
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="15"
                  step="15"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
                  placeholder="60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Price <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
                  placeholder="125.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
            >
              <option value="USD">USD ($)</option>
              <option value="ZWG">ZWG ($)</option>
            </select>
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

          {/* Headline */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Headline
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:bg-white/10 outline-none transition"
                placeholder="Short catchy description..."
              />
            </div>
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
                placeholder="Describe your service..."
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
                placeholder="e.g., Signature, 60 min, Premium"
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
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

