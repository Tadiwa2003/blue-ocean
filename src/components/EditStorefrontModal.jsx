import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import api from '../services/api.js';

export function EditStorefrontModal({ isOpen, onClose, onSuccess, storefront }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [logoUploadMode, setLogoUploadMode] = useState('url');
    const [logoPreview, setLogoPreview] = useState(null);
    const [bgImageUploadMode, setBgImageUploadMode] = useState('url');
    const [bgImagePreview, setBgImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'products',
        design: {
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
            branding: {
                storeName: '',
                tagline: '',
                logo: '',
            },
        },
    });

    // Load storefront data when modal opens
    useEffect(() => {
        if (isOpen && storefront) {
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
                    branding: {
                        storeName: storefront.design?.branding?.storeName || storefront.name || '',
                        tagline: storefront.design?.branding?.tagline || '',
                        logo: storefront.design?.branding?.logo || '',
                    },
                },
            });

            // Set previews if images exist
            if (storefront.design?.branding?.logo) {
                setLogoPreview(storefront.design.branding.logo);
            }
            if (storefront.design?.hero?.backgroundImage) {
                setBgImagePreview(storefront.design.hero.backgroundImage);
            }
        }
    }, [isOpen, storefront]);

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

    // Image compression helper
    const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

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

                    canvas.toBlob(
                        (blob) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        },
                        'image/jpeg',
                        quality
                    );
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
        if (file) {
            try {
                const compressed = await compressImage(file, 800, 800, 0.8);
                setLogoPreview(compressed);
                handleNestedChange('design.branding.logo', compressed);
            } catch (error) {
                console.error('Error compressing logo:', error);
                setError('Failed to process logo image');
            }
        }
    };

    const handleBgImageFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressed = await compressImage(file, 1920, 1920, 0.85);
                setBgImagePreview(compressed);
                handleNestedChange('design.hero.backgroundImage', compressed);
            } catch (error) {
                console.error('Error compressing background image:', error);
                setError('Failed to process background image');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate storefront ID
        const storefrontId = storefront._id || storefront.id;
        if (!storefrontId) {
            setError('Invalid storefront: No ID found');
            setLoading(false);
            return;
        }

        console.log('Updating storefront:', {
            id: storefrontId,
            name: formData.name,
            type: formData.type
        });

        try {
            const response = await api.storefronts.updateStorefront(storefrontId, formData);
            if (response.success) {
                console.log('Storefront updated successfully:', response.data.storefront);
                onSuccess?.(response.data.storefront);
                onClose();
            } else {
                setError(response.error || 'Failed to update storefront');
            }
        } catch (err) {
            console.error('Error updating storefront:', err);
            setError(err.message || 'An error occurred while updating the storefront');
        } finally {
            setLoading(false);
        }
    };

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-br from-ocean/95 to-midnight/95 p-8 shadow-2xl my-auto">
                <style jsx>{`
                    .overflow-y-auto::-webkit-scrollbar {
                        width: 8px;
                    }
                    .overflow-y-auto::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 4px;
                    }
                    .overflow-y-auto::-webkit-scrollbar-thumb {
                        background: rgba(29, 160, 230, 0.3);
                        border-radius: 4px;
                    }
                    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                        background: rgba(29, 160, 230, 0.5);
                    }
                `}</style>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-display font-bold text-white">Edit Storefront</h2>
                    <p className="mt-2 text-sm text-white/60">Update your storefront design and settings</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Basic Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Storefront Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Storefront Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                            >
                                <option value="products">Products Only</option>
                                <option value="spa">Spa Services Only</option>
                                <option value="mixed">Products & Services</option>
                            </select>
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Branding</h3>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Store Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.design.branding.storeName}
                                onChange={(e) => handleNestedChange('design.branding.storeName', e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
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
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                                placeholder="Your store's tagline"
                            />
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Logo
                            </label>
                            <div className="flex gap-2 mb-3">
                                <button
                                    type="button"
                                    onClick={() => setLogoUploadMode('url')}
                                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${logoUploadMode === 'url'
                                        ? 'bg-brand-500/20 text-brand-200 border border-brand-400/30'
                                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <LinkIcon className="w-4 h-4 inline mr-2" />
                                    URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLogoUploadMode('upload')}
                                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${logoUploadMode === 'upload'
                                        ? 'bg-brand-500/20 text-brand-200 border border-brand-400/30'
                                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <Upload className="w-4 h-4 inline mr-2" />
                                    Upload
                                </button>
                            </div>

                            {logoUploadMode === 'url' ? (
                                <input
                                    type="url"
                                    value={formData.design.branding.logo}
                                    onChange={(e) => {
                                        handleNestedChange('design.branding.logo', e.target.value);
                                        setLogoPreview(e.target.value);
                                    }}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                                    placeholder="https://example.com/logo.png"
                                />
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoFileChange}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-200 hover:file:bg-brand-500/30"
                                />
                            )}

                            {logoPreview && (
                                <div className="mt-3">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="h-20 w-auto object-contain rounded-lg border border-white/10 bg-white/5 p-2"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Hero Section</h3>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Hero Title
                            </label>
                            <input
                                type="text"
                                value={formData.design.hero.title}
                                onChange={(e) => handleNestedChange('design.hero.title', e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                                placeholder="Welcome to our store"
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
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                                placeholder="Discover amazing products"
                            />
                        </div>

                        {/* Background Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Hero Background Image
                            </label>
                            <div className="flex gap-2 mb-3">
                                <button
                                    type="button"
                                    onClick={() => setBgImageUploadMode('url')}
                                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${bgImageUploadMode === 'url'
                                        ? 'bg-brand-500/20 text-brand-200 border border-brand-400/30'
                                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <LinkIcon className="w-4 h-4 inline mr-2" />
                                    URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBgImageUploadMode('upload')}
                                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${bgImageUploadMode === 'upload'
                                        ? 'bg-brand-500/20 text-brand-200 border border-brand-400/30'
                                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <Upload className="w-4 h-4 inline mr-2" />
                                    Upload
                                </button>
                            </div>

                            {bgImageUploadMode === 'url' ? (
                                <input
                                    type="url"
                                    value={formData.design.hero.backgroundImage}
                                    onChange={(e) => {
                                        handleNestedChange('design.hero.backgroundImage', e.target.value);
                                        setBgImagePreview(e.target.value);
                                    }}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                                    placeholder="https://example.com/background.jpg"
                                />
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBgImageFileChange}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-200 hover:file:bg-brand-500/30"
                                />
                            )}

                            {bgImagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={bgImagePreview}
                                        alt="Background preview"
                                        className="h-32 w-full object-cover rounded-lg border border-white/10"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Logo Display Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Logo Display Settings</h3>

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
                        <h3 className="text-lg font-semibold text-white">Colors</h3>

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

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t border-white/10">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Updating...' : 'Update Storefront'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
