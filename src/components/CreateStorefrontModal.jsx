import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';
import { Upload, Link as LinkIcon, Image as ImageIcon, Sparkles, Zap, Wind, Waves, Grid } from 'lucide-react';
import api from '../services/api.js';

export function CreateStorefrontModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoUploadMode, setLogoUploadMode] = useState('url'); // 'url' or 'upload'
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'products',
    design: {
      focus: 'beauty',
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
        badge: '',
        pillars: [],
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

  const handleLogoFileChange = (e) => {
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

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      handleNestedChange('design.branding.logo', reader.result);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.name || formData.name.trim().length === 0) {
      setError('Storefront name is required');
      setLoading(false);
      return;
    }

    try {
      console.log('Creating storefront with data:', formData);
      const response = await api.storefronts.createStorefront(formData);
      console.log('Storefront creation response:', response);
      
      if (response.success) {
        // Reset form after successful creation
        setFormData({
          name: '',
          type: 'products',
          design: {
            focus: 'beauty',
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
              badge: '',
              pillars: [],
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
      const errorMessage = err.message || 'Failed to create storefront. Please try again.';
      setError(errorMessage);
      
      // Check if it's an authentication error
      if (errorMessage.includes('Authentication') || errorMessage.includes('sign in')) {
        setError('Please sign in to create a storefront. If you are signed in, try refreshing the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handlePillarsInputChange = (value) => {
    setPillarsInput(value);
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    handleNestedChange('design.branding.pillars', items);
  };

  useEffect(() => {
    if (isOpen) {
      setPillarsInput((formData.design.branding.pillars || []).join(', '));
      setError(null); // Clear any previous errors when modal opens
    }
  }, [isOpen, formData.design.branding.pillars]);

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

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Experience Focus *
                </label>
                <select
                  value={formData.design.focus}
                  onChange={(e) => handleNestedChange('design.focus', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                >
                  <option value="beauty">Beauty & Spa Rituals</option>
                  <option value="wellness">Wellness & Retreats</option>
                  <option value="artisan">Artisan Goods</option>
                  <option value="tech">Tech & Gadgets</option>
                  <option value="lifestyle">Lifestyle Boutique</option>
                </select>
                <p className="mt-1 text-xs text-white/50">
                  We’ll adapt the layout, gradients, and highlights to match this focus automatically.
                </p>
              </div>
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
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Background Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.design.hero.backgroundImage}
                  onChange={(e) => handleNestedChange('design.hero.backgroundImage', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-white/50">Leave empty to use background color only</p>
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

