import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';
import { Upload, Edit, Trash2, Eye, Eye, EyeOff } from 'lucide-react';
import api from '../services/api.js';

export function UpdateStorefrontModal({ isOpen, onClose, storefront, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoUploadMode, setLogoUploadMode] = useState('url'); // 'url' or 'upload'
  const [logoPreview, setLogoPreview] = useState(storefront?.design?.branding?.logo || null);
  const [bgImageUploadMode, setBgImageUploadMode] = useState('url'); // 'url' or 'upload'
  const [bgImagePreview, setBgImagePreview] = useState(storefront?.design?.hero?.backgroundImage || null);
  const [formData, setFormData] = useState({
    name: storefront?.name || '',
    type: storefront?.type || 'products',
    design: {
      hero: {
        title: storefront?.design?.hero?.title || '',
        subtitle: storefront?.design?.hero?.subtitle || '',
        backgroundColor: storefront?.design?.hero?.backgroundColor || '#0b233e',
        backgroundImage: storefront?.design?.hero?.backgroundImage || '',
        showLogo: storefront?.design?.hero?.showLogo !== false,
        logoSize: storefront?.design?.hero?.logoSize || 'medium',
      },
      colors: {
        primary: storefront?.design?.colors?.primary || '#1da0e6',
        secondary: storefront?.design?.colors?.secondary || '#0b233e',
        accent: storefront?.design?.colors?.accent || '#ffffff',
      },
      layout: {
        productCardStyle: storefront?.design?.layout?.productCardStyle || 'modern',
        gridColumns: storefront?.design?.layout?.gridColumns || 4,
      },
      branding: {
        storeName: storefront?.design?.branding?.storeName || '',
        tagline: storefront?.design?.branding?.tagline || '',
        logo: storefront?.design?.branding?.logo || '',
      },
      settings: {
        showCategories: storefront?.settings?.showCategories !== false,
        showSearch: storefront?.settings?.showSearch !== false,
        showCart: storefront?.settings?.showCart !== false,
        enableCheckout: storefront?.settings?.enableCheckout !== false,
      },
    },
  });

  // Update form data when storefront prop changes
  useEffect(() => {
    if (storefront) {
      setFormData({
        name: storefront.name || '',
        type: storefront.type || 'products',
        design: {
          hero: {
            title: storefront.design?.hero?.title || '',
            subtitle: storefront.design?.hero?.subtitle || '',
            backgroundColor: storefront.design?.hero?.backgroundColor || '#0b233e',
            backgroundImage: storefront.design?.hero?.backgroundImage || '',
            showLogo: storefront.design?.hero?.showLogo !== false,
            logoSize: storefront.design?.hero?.logoSize || 'medium',
          },
          colors: {
            primary: storefront.design?.colors?.primary || '#1da0e6',
            secondary: storefront.design?.colors?.secondary || '#0b233e',
            accent: storefront.design?.colors?.accent || '#ffffff',
          },
          layout: {
            productCardStyle: storefront.design?.layout?.productCardStyle || 'modern',
            gridColumns: storefront.design?.layout?.gridColumns || 4,
          },
          branding: {
            storeName: storefront.design?.branding?.storeName || '',
            tagline: storefront.design?.branding?.tagline || '',
            logo: storefront.design?.branding?.logo || '',
          },
          settings: {
            showCategories: storefront.settings?.showCategories !== false,
            showSearch: storefront.settings?.showSearch !== false,
            showCart: storefront.settings?.showCart !== false,
            enableCheckout: storefront.settings?.enableCheckout !== false,
          },
        },
      });

      // Set preview states
      setLogoPreview(storefront?.design?.branding?.logo || null);
      setBgImagePreview(storefront?.design?.hero?.backgroundImage || null);
      setLogoUploadMode('url');
      setBgImageUploadMode('url');
      setError(null);
    }
  }, [storefront]);

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
      const response = await api.storefronts.updateStorefront(storefront._id, formData);
      if (response.success) {
        onSuccess?.(response.data.storefront);
        onClose();
      } else {
        // Handle validation errors
        if (response.errors && Array.isArray(response.errors)) {
          const errorMessages = response.errors.map(err => err.msg || err.message).join(', ');
          setError(errorMessages || response.message || 'Failed to update storefront');
        } else {
          setError(response.message || 'Failed to update storefront');
        }
      }
    } catch (err) {
      console.error('Error updating storefront:', err);
      setError(err.message || 'Failed to update storefront. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStorefront = async () => {
    if (!storefront?._id) return;

    if (!confirm('Are you sure you want to delete this storefront? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.storefronts.deleteStorefront(storefront._id);
      if (response.success) {
        onSuccess?.(null); // Pass null to indicate deletion
        onClose();
      } else {
        setError(response.message || 'Failed to delete storefront');
      }
    } catch (err) {
      console.error('Error deleting storefront:', err);
      setError(err.message || 'Failed to delete storefront. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Storefront</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Logo Section */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Storefront Logo</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={formData.design.branding.logo || ''}
                  onChange={(e) => {
                    setLogoUploadMode('url');
                    handleNestedChange('design.branding.logo', e.target.value);
                  }}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">or</span>
                <button
                  type="button"
                  onClick={() => setLogoUploadMode('upload')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    logoUploadMode === 'upload'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </button>
              </div>
            </div>

            {logoPreview && logoUploadMode === 'upload' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <div className="flex justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-32 w-32 object-contain border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Background Image Section */}
            <h4 className="text-md font-semibold text-gray-900 mb-4">Hero Background Image</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                <input
                  type="url"
                  value={formData.design.hero.backgroundImage || ''}
                  onChange={(e) => {
                    setBgImageUploadMode('url');
                    handleNestedChange('design.hero.backgroundImage', e.target.value);
                  }}
                  placeholder="https://example.com/background.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">or</span>
                <button
                  type="button"
                  onClick={() => setBgImageUploadMode('upload')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    bgImageUploadMode === 'upload'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </button>
              </div>
            </div>

            {bgImagePreview && bgImageUploadMode === 'upload' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <div className="flex justify-center">
                  <img
                    src={bgImagePreview}
                    alt="Background preview"
                    className="h-32 w-32 object-contain border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Other Settings */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Storefront Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNestedChange('name', e.target.value)}
                  placeholder="My Storefront"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Storefront Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleNestedChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="products">Products</option>
                  <option value="spa">Beauty Spa</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Hero Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.design.hero.showLogo !== false}
                      onChange={(e) => handleNestedChange('design.hero.showLogo', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Show Logo in Hero Section</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Size</label>
                  <select
                    value={formData.design.hero.logoSize}
                    onChange={(e) => handleNestedChange('design.hero.logoSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="small">Small (64px)</option>
                    <option value="medium">Medium (80px)</option>
                    <option value="large">Large (96px)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Colors</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={formData.design.colors.primary}
                    onChange={(e) => handleNestedChange('design.colors.primary', e.target.value)}
                    className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <input
                    type="color"
                    value={formData.design.colors.secondary}
                    onChange={(e) => handleNestedChange('design.colors.secondary', e.target.value)}
                    className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <input
                    type="color"
                    value={formData.design.colors.accent}
                    onChange={(e) => handleNestedChange('design.colors.accent', e.target.value)}
                    className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Layout Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Card Style</label>
                  <select
                    value={formData.design.layout.productCardStyle}
                    onChange={(e) => handleNestedChange('design.layout.productCardStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grid Columns</label>
                  <select
                    value={formData.design.layout.gridColumns}
                    onChange={(e) => handleNestedChange('design.layout.gridColumns', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Branding</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    value={formData.design.branding.storeName}
                    onChange={(e) => handleNestedChange('design.branding.storeName', e.target.value)}
                    placeholder="My Storefront"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <textarea
                    value={formData.design.branding.tagline}
                    onChange={(e) => handleNestedChange('design.branding.tagline', e.target.value)}
                    placeholder="Your store tagline here"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.showCategories !== false}
                      onChange={(e) => handleNestedChange('settings.showCategories', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Show Categories</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.showSearch !== false}
                      onChange={(e) => handleNestedChange('settings.showSearch', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Show Search</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.showCart !== false}
                      onChange={(e) => handleNestedChange('settings.showCart', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Show Cart</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.enableCheckout !== false}
                      onChange={(e) => handleNestedChange('settings.enableCheckout', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enable Checkout</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Storefront'}
            </button>

            <button
              type="button"
              onClick={handleDeleteStorefront}
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Deleting...' : 'Delete Storefront'}
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-700">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}