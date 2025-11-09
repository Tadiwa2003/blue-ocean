import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';
import { getProductVariants, findRelatedProducts } from '../utils/productVariants.js';
import { highlightProducts } from '../data/products.js';

const fallbackImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1da0e6" />
          <stop offset="100%" stop-color="#0b233e" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad)" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" fill="rgba(255,255,255,0.85)">
        Blue Ocean
      </text>
    </svg>
  `);

export function ProductDetailsModal({ product, open, onClose, onViewProduct, onAddToCart }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(product?.image || fallbackImage);
  const [imageError, setImageError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Get actual variants for this product
  const productVariants = product ? getProductVariants(product.id) : { colors: [], sizes: [] };
  const colorVariants = productVariants.colors || [];
  const sizeVariants = productVariants.sizes || [];
  const requiresColorSelection = colorVariants.length > 0;
  const requiresSizeSelection = sizeVariants.length > 0;

  // Initialize selections
  useEffect(() => {
    if (product && open) {
      const variants = getProductVariants(product.id);
      setSelectedColor(variants.colors[0] || '');
      setSelectedSize(variants.sizes[0] || '');
      setSelectedImage(product.image || fallbackImage);
      setImageError(false);
      setRelatedProducts([]);
    }
  }, [product, open]);

  // Find related products when size is selected
  useEffect(() => {
    if (product && selectedSize) {
      const related = findRelatedProducts(product, selectedSize, highlightProducts);
      setRelatedProducts(related);
    } else {
      setRelatedProducts([]);
    }
  }, [product, selectedSize]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open || !product) return null;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedColor, selectedSize);
      // Optionally close modal after adding
      // onClose();
    }
  };

  const handleRelatedProductClick = (relatedProduct) => {
    if (onViewProduct) {
      onViewProduct(relatedProduct);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-midnight/95 px-4 py-6 backdrop-blur-md overflow-y-auto">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .modal-backdrop {
          animation: fadeIn 0.3s ease-out;
        }
        .modal-content {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
      {/* Backdrop */}
      <div className="absolute inset-0 modal-backdrop" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-gradient-to-br from-ocean/95 to-midnight/98 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden modal-content">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-white hover:bg-white/20 transition backdrop-blur-sm"
        >
          Close
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left: Image Gallery */}
          <div className="relative bg-gradient-to-br from-ocean/50 to-midnight/80 p-6 sm:p-8 lg:p-12">
            <div className="lg:sticky lg:top-8">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={() => {
                    if (!imageError) {
                      setImageError(true);
                      setSelectedImage(fallbackImage);
                    }
                  }}
                />
                {product.badges && product.badges.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {product.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-black/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                {[product.image, product.image, product.image].slice(0, 3).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img || fallbackImage)}
                    className={`flex-shrink-0 h-20 w-20 rounded-xl border-2 overflow-hidden transition ${
                      selectedImage === img
                        ? 'border-brand-400 shadow-lg shadow-brand-400/30'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={img || fallbackImage}
                      alt={`View ${idx + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-midnight/90 to-ocean/50">
            <div className="flex-1 space-y-6">
              {/* Category & Name */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-300 mb-2">
                  {product.category}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-brand-300">{product.price}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-base leading-relaxed text-white/80">{product.description}</p>
              </div>

              {/* Color Variants */}
              {colorVariants.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
                    Select Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colorVariants.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-2xl border-2 px-5 py-3 text-sm font-semibold transition-all ${
                          selectedColor === color
                            ? 'border-brand-400 bg-brand-500/20 text-white shadow-lg shadow-brand-400/30'
                            : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                  {colorVariants.length === 0 && (
                    <p className="text-sm text-white/50 italic">Color options coming soon</p>
                  )}
                </div>
              )}

              {/* Size Variants */}
              {sizeVariants.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
                    {product.category === 'Slides & Sandals' || product.category === 'Nike & Jordan'
                      ? 'Select Size'
                      : product.category === 'Clothing'
                        ? 'Select Size'
                        : product.category === 'Beauty Spa Services'
                          ? 'Select Duration'
                          : product.category.includes('Bag') || product.category === 'Totes' || product.category === 'Backpacks'
                            ? 'Select Size'
                            : 'Select Type'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {sizeVariants.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-2xl border-2 px-5 py-3 text-sm font-semibold transition-all ${
                          selectedSize === size
                            ? 'border-brand-400 bg-brand-500/20 text-white shadow-lg shadow-brand-400/30'
                            : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Products Section - Show when size is selected and related products exist */}
              {relatedProducts.length > 0 && selectedSize && (
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white/70 mb-4">
                    Available in {selectedSize}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {relatedProducts.map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        onClick={() => handleRelatedProductClick(relatedProduct)}
                        className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-brand-400/40 hover:bg-white/10 transition"
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-2">
                          <img
                            src={relatedProduct.image || fallbackImage}
                            alt={relatedProduct.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition"
                            onError={(e) => {
                              e.currentTarget.src = fallbackImage;
                            }}
                          />
                        </div>
                        <p className="text-xs font-semibold text-white/90 truncate">{relatedProduct.name}</p>
                        <p className="text-sm font-bold text-brand-300">{relatedProduct.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features/Details */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
                  Product Details
                </h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-1">✓</span>
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-1">✓</span>
                    <span>Free shipping on orders over $100</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-1">✓</span>
                    <span>30-day return policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-1">✓</span>
                    <span>Authenticity guaranteed</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <Button 
                onClick={handleAddToCart} 
                className="w-full justify-center text-base py-4"
                disabled={(requiresColorSelection && !selectedColor) || (requiresSizeSelection && !selectedSize)}
              >
                Add to Cart
                {(selectedColor || selectedSize) && (
                  <span className="ml-2 text-sm text-white/80">
                    {selectedColor && selectedSize
                      ? `(${selectedColor}, ${selectedSize})`
                      : selectedColor
                        ? `(${selectedColor})`
                        : `(${selectedSize})`}
                  </span>
                )}
              </Button>
              <Button variant="secondary" className="w-full justify-center text-base py-4">
                Save for Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

