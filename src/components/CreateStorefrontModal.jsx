import { useState } from 'react';
import { Button } from './Button.jsx';
import { Upload, Link as LinkIcon, Image as ImageIcon, Sparkles, Zap, Wind, Waves, Grid } from 'lucide-react';
import api from '../services/api.js';
import { trackTemplateSelection, trackStorefrontCreated } from '../utils/analytics.js';

export function CreateStorefrontModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoUploadMode, setLogoUploadMode] = useState('url'); // 'url' or 'upload'
  const [logoPreview, setLogoPreview] = useState(null);
  const [bgImageUploadMode, setBgImageUploadMode] = useState('url'); // 'url' or 'upload'
  const [bgImagePreview, setBgImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'products',
    design: {
      template: null, // Track selected template
      hero: {
        title: '',
        subtitle: '',
        backgroundColor: '#0b233e',
        backgroundImage: '',
        showLogo: true,
        logoSize: 'medium',
      },
      colors: {
        primary: '#1da0e6',
        secondary: '#0b233e',
        accent: '#ffffff',
      },
      layout: {
        productCardStyle: 'modern',
        gridColumns: 4,
      },
      branding: {
        storeName: '',
        tagline: '',
        logo: '',
      },
      animations: {
        background: 'none', // none, gradient, fluid, particles, mesh
        content: 'fade', // none, fade, slide, zoom, typewriter
      },
    },
    settings: {
      showCategories: true,
      showSearch: true,
      showCart: true,
      enableCheckout: true,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleNestedChange = (path, value) => {
    const keys = path.split('.');
    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Helper function to compress image
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Logo file size must be less than 5MB');
      return;
    }

    try {
      // Compress image before upload
      const compressedImage = await compressImage(file, 800, 800, 0.8);
      setLogoPreview(compressedImage);
      handleNestedChange('design.branding.logo', compressedImage);
      setError(null);
    } catch (error) {
      console.error('Error compressing image:', error);
      setError('Failed to process image. Please try another file.');
    }
  };

  const handleBgImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Background image file size must be less than 5MB');
      return;
    }

    try {
      // Compress image before upload (larger dimensions for backgrounds)
      const compressedImage = await compressImage(file, 1920, 1920, 0.85);
      setBgImagePreview(compressedImage);
      handleNestedChange('design.hero.backgroundImage', compressedImage);
      setError(null);
    } catch (error) {
      console.error('Error compressing image:', error);
      setError('Failed to process image. Please try another file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.storefronts.createStorefront(formData);
      if (response.success) {
        // Reset form after successful creation
        setFormData({
          name: '',
          type: 'products',
          design: {
            template: null,
            hero: {
              title: '',
              subtitle: '',
              backgroundColor: '#0b233e',
              backgroundImage: '',
              showLogo: true,
              logoSize: 'medium',
            },
            colors: {
              primary: '#1da0e6',
              secondary: '#0b233e',
              accent: '#ffffff',
            },
            layout: {
              productCardStyle: 'modern',
              gridColumns: 4,
            },
            branding: {
              storeName: '',
              tagline: '',
              logo: '',
            },
            animations: {
              background: 'none',
              content: 'fade',
            },
          },
          settings: {
            showCategories: true,
            showSearch: true,
            showCart: true,
            enableCheckout: true,
          },
        });
        setLogoUploadMode('url');
        setLogoPreview(null);
        setBgImageUploadMode('url');
        setBgImagePreview(null);
        onSuccess?.(response.data.storefront);
        onClose();
      } else {
        // Handle validation errors
        if (response.errors && Array.isArray(response.errors)) {
          const errorMessages = response.errors.map(err => err.msg || err.message).join(', ');
          setError(errorMessages || response.message || 'Failed to create storefront');
        } else {
          setError(response.message || 'Failed to create storefront');
        }
      }
    } catch (err) {
      console.error('Error creating storefront:', err);
      setError(err.message || 'Failed to create storefront. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-midnight/95 backdrop-blur-md">
      <div className="relative w-full max-w-3xl mx-4 bg-gradient-to-br from-ocean/95 to-midnight/98 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-white">Create Your Storefront</h2>
            <button
              onClick={onClose}
              className="rounded-full border border-white/20 bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Storefront Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  placeholder="e.g., My Fashion Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Storefront Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                >
                  <option value="products">Products Store</option>
                  <option value="spa">Beauty Spa</option>
                  <option value="mixed">Mixed (Products & Spa)</option>
                </select>
              </div>
            </div>

            {/* Design Template Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-brand-400" />
                <h3 className="text-lg font-semibold text-white">Choose Your Design Template</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Select a pre-designed template to get started quickly. You can customize all settings later.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: 'modern',
                    name: 'Modern Elegance',
                    category: 'Modern',
                    icon: '✨',
                    description: 'Contemporary design with vibrant gradients',
                    bestFor: 'Fashion, Tech, Creative Agencies',
                    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    config: {
                      colors: { primary: '#667eea', secondary: '#0b233e', accent: '#764ba2' },
                      hero: { backgroundColor: '#0b233e', logoSize: 'medium' },
                      layout: { productCardStyle: 'modern', gridColumns: 4 },
                      animations: { background: 'gradient', content: 'fade' }
                    },
                    features: ['Dynamic gradient animations', 'Smooth fade transitions', 'Modern card layouts', '4-column responsive grid']
                  },
                  {
                    id: 'classic',
                    name: 'Classic Boutique',
                    category: 'Classic',
                    icon: '👔',
                    description: 'Timeless sophistication and elegance',
                    bestFor: 'Luxury Brands, Jewelry, Premium Services',
                    preview: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #4a5f7f 100%)',
                    config: {
                      colors: { primary: '#34495e', secondary: '#2c3e50', accent: '#ecf0f1' },
                      hero: { backgroundColor: '#2c3e50', logoSize: 'large' },
                      layout: { productCardStyle: 'classic', gridColumns: 3 },
                      animations: { background: 'none', content: 'slide' }
                    },
                    features: ['Elegant serif typography', 'Refined color palette', 'Classic card styling', 'Professional 3-column layout']
                  },
                  {
                    id: 'minimal',
                    name: 'Minimalist Chic',
                    category: 'Minimal',
                    icon: '⚪',
                    description: 'Clean simplicity with maximum impact',
                    bestFor: 'Art Galleries, Photography, Design Studios',
                    preview: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #a8b8d8 100%)',
                    config: {
                      colors: { primary: '#3498db', secondary: '#ecf0f1', accent: '#2c3e50' },
                      hero: { backgroundColor: '#ffffff', logoSize: 'small' },
                      layout: { productCardStyle: 'minimal', gridColumns: 4 },
                      animations: { background: 'none', content: 'fade' }
                    },
                    features: ['Ultra-clean interface', 'Whitespace mastery', 'Minimal distractions', 'Product-focused design']
                  },
                  {
                    id: 'vibrant',
                    name: 'Bold & Vibrant',
                    category: 'Bold',
                    icon: '🎨',
                    description: 'Eye-catching colors that demand attention',
                    bestFor: 'Youth Brands, Events, Entertainment',
                    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #feca57 100%)',
                    config: {
                      colors: { primary: '#f5576c', secondary: '#4facfe', accent: '#f093fb' },
                      hero: { backgroundColor: '#4facfe', logoSize: 'large' },
                      layout: { productCardStyle: 'modern', gridColumns: 3 },
                      animations: { background: 'particles', content: 'zoom' }
                    },
                    features: ['High-energy color scheme', 'Dynamic particle effects', 'Zoom animations', 'Bold visual statements']
                  },
                  {
                    id: 'luxury',
                    name: 'Luxury Premium',
                    category: 'Luxury',
                    icon: '👑',
                    description: 'Opulent design for exclusive brands',
                    bestFor: 'High-End Retail, Luxury Spas, VIP Services',
                    preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    config: {
                      colors: { primary: '#d4af37', secondary: '#1a1a2e', accent: '#ffffff' },
                      hero: { backgroundColor: '#16213e', logoSize: 'large' },
                      layout: { productCardStyle: 'modern', gridColumns: 3 },
                      animations: { background: 'fluid', content: 'fade' }
                    },
                    features: ['Gold accent highlights', 'Premium dark theme', 'Fluid glass effects', 'Exclusive atmosphere']
                  },
                  {
                    id: 'nature',
                    name: 'Eco Natural',
                    category: 'Natural',
                    icon: '🌿',
                    description: 'Organic aesthetics with earthy warmth',
                    bestFor: 'Organic Products, Wellness, Sustainability',
                    preview: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 50%, #c5e99b 100%)',
                    config: {
                      colors: { primary: '#56ab2f', secondary: '#2d5016', accent: '#a8e063' },
                      hero: { backgroundColor: '#2d5016', logoSize: 'medium' },
                      layout: { productCardStyle: 'classic', gridColumns: 4 },
                      animations: { background: 'mesh', content: 'slide' }
                    },
                    features: ['Natural color palette', 'Eco-friendly vibe', 'Mesh grid background', 'Organic transitions']
                  },
                  {
                    id: 'ocean',
                    name: 'Ocean Breeze',
                    category: 'Modern',
                    icon: '🌊',
                    description: 'Fresh aquatic tones with fluid motion',
                    bestFor: 'Travel, Water Sports, Coastal Brands',
                    preview: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 50%, #00a8cc 100%)',
                    config: {
                      colors: { primary: '#00d2ff', secondary: '#1e3a8a', accent: '#60a5fa' },
                      hero: { backgroundColor: '#1e3a8a', logoSize: 'medium' },
                      layout: { productCardStyle: 'modern', gridColumns: 4 },
                      animations: { background: 'fluid', content: 'fade' }
                    },
                    features: ['Calming blue palette', 'Fluid wave animations', 'Fresh modern feel', 'Coastal atmosphere']
                  },
                  {
                    id: 'sunset',
                    name: 'Sunset Glow',
                    category: 'Bold',
                    icon: '🌅',
                    description: 'Warm sunset hues that inspire',
                    bestFor: 'Food & Beverage, Hospitality, Lifestyle',
                    preview: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9a56 100%)',
                    config: {
                      colors: { primary: '#ff6b6b', secondary: '#ee5a6f', accent: '#feca57' },
                      hero: { backgroundColor: '#ee5a6f', logoSize: 'large' },
                      layout: { productCardStyle: 'modern', gridColumns: 3 },
                      animations: { background: 'gradient', content: 'slide' }
                    },
                    features: ['Warm inviting colors', 'Sunset gradient flow', 'Cozy atmosphere', 'Welcoming design']
                  },
                  {
                    id: 'tech',
                    name: 'Tech Modern',
                    category: 'Modern',
                    icon: '⚡',
                    description: 'Futuristic cyberpunk aesthetics',
                    bestFor: 'Tech Startups, Gaming, Digital Services',
                    preview: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                    config: {
                      colors: { primary: '#00f2fe', secondary: '#0f0c29', accent: '#4facfe' },
                      hero: { backgroundColor: '#0f0c29', logoSize: 'medium' },
                      layout: { productCardStyle: 'modern', gridColumns: 4 },
                      animations: { background: 'particles', content: 'zoom' }
                    },
                    features: ['Neon accent colors', 'Cyberpunk aesthetic', 'Particle effects', 'Tech-forward design']
                  },
                  {
                    id: 'pastel',
                    name: 'Pastel Dreams',
                    category: 'Minimal',
                    icon: '🎀',
                    description: 'Soft dreamy colors with gentle elegance',
                    bestFor: 'Beauty, Baby Products, Feminine Brands',
                    preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ffd1dc 100%)',
                    config: {
                      colors: { primary: '#ff9a9e', secondary: '#fad0c4', accent: '#ffecd2' },
                      hero: { backgroundColor: '#fad0c4', logoSize: 'small' },
                      layout: { productCardStyle: 'minimal', gridColumns: 3 },
                      animations: { background: 'none', content: 'fade' }
                    },
                    features: ['Soft pastel palette', 'Gentle transitions', 'Dreamy atmosphere', 'Delicate aesthetics']
                  },
                ].map((template) => {
                  const isSelected = formData.design?.template === template.id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        // Track template selection
                        trackTemplateSelection(template.id, template.name);

                        // Apply template configuration
                        setFormData(prev => ({
                          ...prev,
                          design: {
                            ...prev.design,
                            template: template.id,
                            colors: template.config.colors,
                            hero: {
                              ...prev.design.hero,
                              backgroundColor: template.config.hero.backgroundColor,
                              logoSize: template.config.hero.logoSize,
                            },
                            layout: template.config.layout,
                            animations: template.config.animations,
                          }
                        }));
                      }}
                      className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-500 text-left shadow-xl ${isSelected
                        ? 'border-brand-400 ring-4 ring-brand-400/30 scale-105 shadow-2xl shadow-brand-500/50'
                        : 'border-white/10 hover:border-white/30 hover:scale-[1.02] hover:shadow-2xl'
                        }`}
                    >
                      {/* Premium Template Preview */}
                      <div
                        className="h-40 w-full relative overflow-hidden"
                        style={{ background: template.preview }}
                      >
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 group-hover:from-black/30 group-hover:to-black/50 transition-all duration-500" />

                        {/* Category Badge - Top Left */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg ${template.category === 'Modern' ? 'bg-purple-500/30 border-purple-400/40 text-purple-100' :
                            template.category === 'Classic' ? 'bg-slate-500/30 border-slate-400/40 text-slate-100' :
                              template.category === 'Minimal' ? 'bg-blue-500/30 border-blue-400/40 text-blue-100' :
                                template.category === 'Bold' ? 'bg-pink-500/30 border-pink-400/40 text-pink-100' :
                                  template.category === 'Luxury' ? 'bg-amber-500/30 border-amber-400/40 text-amber-100' :
                                    'bg-green-500/30 border-green-400/40 text-green-100'
                            }`}>
                            {template.icon && <span className="text-sm">{template.icon}</span>}
                            {template.category}
                          </span>
                        </div>

                        {/* Selected indicator - Top Right */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-brand-400 text-white rounded-full p-2.5 shadow-lg animate-in zoom-in duration-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}

                        {/* Template name overlay - Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <h4 className="text-white font-display font-bold text-base drop-shadow-lg">
                            {template.name}
                          </h4>
                          <p className="text-white/80 text-xs mt-0.5">{template.description}</p>
                        </div>

                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </div>
                      </div>

                      {/* Template details */}
                      <div className="p-5 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm">
                        {/* Best For section */}
                        <div className="mb-3 pb-3 border-b border-white/10">
                          <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Best For</p>
                          <p className="text-xs text-white/80 font-medium">{template.bestFor}</p>
                        </div>

                        {/* Features */}
                        <div className="space-y-1.5">
                          {template.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-white/70">
                              <svg className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="leading-tight">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Color palette preview */}
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Color Palette</p>
                          <div className="flex gap-1.5">
                            <div
                              className="w-8 h-8 rounded-lg border-2 border-white/30 shadow-md transition-transform hover:scale-110"
                              style={{ backgroundColor: template.config.colors.primary }}
                              title={`Primary: ${template.config.colors.primary}`}
                            />
                            <div
                              className="w-8 h-8 rounded-lg border-2 border-white/30 shadow-md transition-transform hover:scale-110"
                              style={{ backgroundColor: template.config.colors.secondary }}
                              title={`Secondary: ${template.config.colors.secondary}`}
                            />
                            <div
                              className="w-8 h-8 rounded-lg border-2 border-white/30 shadow-md transition-transform hover:scale-110"
                              style={{ backgroundColor: template.config.colors.accent }}
                              title={`Accent: ${template.config.colors.accent}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Premium hover glow effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${template.config.colors.primary}20 0%, transparent 70%)`,
                        }}
                      />

                      {/* Selection pulse effect */}
                      {isSelected && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-0 border-2 border-brand-400 rounded-3xl animate-pulse" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-white/50 mt-4 text-center">
                💡 Tip: Choose a template that matches your brand. You can customize colors, layout, and all settings in the sections below.
              </p>
            </div>

            {/* Hero Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={formData.design.hero.title}
                  onChange={(e) => handleNestedChange('design.hero.title', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  placeholder="Welcome to My Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={formData.design.hero.subtitle}
                  onChange={(e) => handleNestedChange('design.hero.subtitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  placeholder="Discover our amazing collection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={formData.design.hero.backgroundColor}
                  onChange={(e) => handleNestedChange('design.hero.backgroundColor', e.target.value)}
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/5 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Background Image (optional)
                </label>

                {/* Upload Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setBgImageUploadMode('url');
                      setBgImagePreview(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition ${bgImageUploadMode === 'url'
                      ? 'bg-brand-400/20 border-brand-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBgImageUploadMode('upload');
                      handleNestedChange('design.hero.backgroundImage', '');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition ${bgImageUploadMode === 'upload'
                      ? 'bg-brand-400/20 border-brand-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Upload</span>
                  </button>
                </div>

                {/* URL Input */}
                {bgImageUploadMode === 'url' && (
                  <div>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                      <input
                        type="url"
                        value={formData.design.hero.backgroundImage}
                        onChange={(e) => {
                          handleNestedChange('design.hero.backgroundImage', e.target.value);
                          setBgImagePreview(e.target.value);
                        }}
                        className="w-full px-4 py-3 pl-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                        placeholder="https://example.com/background.jpg"
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/50">
                      Enter the URL of your background image
                    </p>
                  </div>
                )}

                {/* File Upload */}
                {bgImageUploadMode === 'upload' && (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-white/40 mb-2" />
                        <p className="text-sm text-white/60 mb-1">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-white/40">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleBgImageFileChange}
                      />
                    </label>
                    <p className="mt-2 text-xs text-white/50">
                      Upload your background image file
                    </p>
                  </div>
                )}

                {/* Background Image Preview */}
                {(bgImagePreview || formData.design.hero.backgroundImage) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-white/80 mb-2">Preview:</p>
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                      <img
                        src={bgImagePreview || formData.design.hero.backgroundImage}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          setBgImagePreview(null);
                        }}
                        onLoad={() => {
                          if (bgImageUploadMode === 'url' && !bgImagePreview) {
                            setBgImagePreview(formData.design.hero.backgroundImage);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Effects & Animations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-brand-400" />
                <h3 className="text-lg font-semibold text-white">Visual Effects</h3>
              </div>

              {/* Background Animation Selection */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Background Animation
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'none', name: 'Static', icon: ImageIcon, desc: 'No animation' },
                    { id: 'gradient', name: 'Gradient Flow', icon: Wind, desc: 'Soft color shifts' },
                    { id: 'fluid', name: 'Fluid Glass', icon: Waves, desc: 'Interactive 3D liquid' },
                    { id: 'particles', name: 'Particles', icon: Sparkles, desc: 'Floating specks' },
                    { id: 'mesh', name: 'Mesh Grid', icon: Grid, desc: 'Cyberpunk grid' },
                  ].map((anim) => (
                    <button
                      key={anim.id}
                      type="button"
                      onClick={() => handleNestedChange('design.animations.background', anim.id)}
                      className={`relative p-3 rounded-xl border text-left transition-all duration-200 group ${formData.design.animations?.background === anim.id
                        ? 'bg-brand-400/20 border-brand-400/50 ring-1 ring-brand-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                    >
                      <div className={`p-2 rounded-lg inline-flex mb-2 ${formData.design.animations?.background === anim.id ? 'bg-brand-400/20 text-brand-300' : 'bg-white/10 text-white/60'
                        }`}>
                        <anim.icon className="h-5 w-5" />
                      </div>
                      <div className="font-medium text-white text-sm">{anim.name}</div>
                      <div className="text-xs text-white/50 mt-0.5">{anim.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Animation Selection */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Hero Content Entry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'none', name: 'Instant', icon: Zap },
                    { id: 'fade', name: 'Fade In', icon: Wind },
                    { id: 'slide', name: 'Slide Up', icon: Upload },
                    { id: 'zoom', name: 'Zoom', icon: ImageIcon },
                  ].map((anim) => (
                    <button
                      key={anim.id}
                      type="button"
                      onClick={() => handleNestedChange('design.animations.content', anim.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${formData.design.animations?.content === anim.id
                        ? 'bg-brand-400/20 border-brand-400/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      <anim.icon className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">{anim.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Branding</h3>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.design.branding.storeName}
                  onChange={(e) => handleNestedChange('design.branding.storeName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  placeholder="Your Store Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.design.branding.tagline}
                  onChange={(e) => handleNestedChange('design.branding.tagline', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  placeholder="Your store tagline"
                />
              </div>

              {/* Logo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Store Logo
                </label>

                {/* Upload Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUploadMode('url');
                      setLogoPreview(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition ${logoUploadMode === 'url'
                      ? 'bg-brand-400/20 border-brand-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUploadMode('upload');
                      handleNestedChange('design.branding.logo', '');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition ${logoUploadMode === 'upload'
                      ? 'bg-brand-400/20 border-brand-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Upload</span>
                  </button>
                </div>

                {/* URL Input */}
                {logoUploadMode === 'url' && (
                  <div>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                      <input
                        type="url"
                        value={formData.design.branding.logo}
                        onChange={(e) => {
                          handleNestedChange('design.branding.logo', e.target.value);
                          setLogoPreview(e.target.value);
                        }}
                        className="w-full px-4 py-3 pl-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/50">
                      Enter the URL of your logo image
                    </p>
                  </div>
                )}

                {/* File Upload */}
                {logoUploadMode === 'upload' && (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-white/40 mb-2" />
                        <p className="text-sm text-white/60 mb-1">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-white/40">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                      />
                    </label>
                    <p className="mt-2 text-xs text-white/50">
                      Upload your logo image file
                    </p>
                  </div>
                )}

                {/* Logo Preview */}
                {(logoPreview || formData.design.branding.logo) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-white/80 mb-2">Preview:</p>
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                      <img
                        src={logoPreview || formData.design.branding.logo}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          setLogoPreview(null);
                        }}
                        onLoad={() => {
                          if (logoUploadMode === 'url' && !logoPreview) {
                            setLogoPreview(formData.design.branding.logo);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Logo Display Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Logo Display Settings</h3>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Logo Size in Hero Section
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'small', name: 'Small', size: '96px' },
                    { id: 'medium', name: 'Medium', size: '128px' },
                    { id: 'large', name: 'Large', size: '160px' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleNestedChange('design.hero.logoSize', size.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${formData.design.hero.logoSize === size.id
                        ? 'bg-brand-400/20 border-brand-400/50 text-white ring-1 ring-brand-400/50'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      <div className="text-sm font-semibold mb-1">{size.name}</div>
                      <div className="text-xs opacity-70">{size.size}</div>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-white/50">
                  Choose how large your logo appears in the hero section
                </p>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Color Scheme</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={formData.design.colors.primary}
                    onChange={(e) => handleNestedChange('design.colors.primary', e.target.value)}
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/5 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={formData.design.colors.secondary}
                    onChange={(e) => handleNestedChange('design.colors.secondary', e.target.value)}
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/5 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={formData.design.colors.accent}
                    onChange={(e) => handleNestedChange('design.colors.accent', e.target.value)}
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/5 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Layout Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Layout Options</h3>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Product Card Style
                </label>
                <select
                  value={formData.design.layout.productCardStyle}
                  onChange={(e) => handleNestedChange('design.layout.productCardStyle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Grid Columns
                </label>
                <select
                  value={formData.design.layout.gridColumns}
                  onChange={(e) => handleNestedChange('design.layout.gridColumns', parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                >
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                  <option value={4}>4 Columns</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Storefront'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

