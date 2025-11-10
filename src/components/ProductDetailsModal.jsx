import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button.jsx';
import { getProductVariants, findRelatedProducts } from '../utils/productVariants.js';
import { highlightProducts } from '../data/products.js';
import { ChevronLeft, ChevronRight, Heart, Star, Check, Truck, ShieldCheck } from 'lucide-react';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const containerRef = useRef(null);
  const imageGallery = [product?.image, product?.image, product?.image].filter(Boolean).slice(0, 3);

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
      setCurrentImageIndex(0);
      setImageError(false);
      setRelatedProducts([]);
      setQuantity(1);
      setActiveTab('description');
    }
  }, [product, open]);

  // GSAP animations
  useEffect(() => {
    if (!open || !containerRef.current) return;

    const container = containerRef.current;
    gsap.fromTo(
      container,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
    );

    return () => {
      gsap.killTweensOf(container);
    };
  }, [open]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageGallery.length - 1 ? 0 : prev + 1
    );
    setSelectedImage(imageGallery[currentImageIndex === imageGallery.length - 1 ? 0 : currentImageIndex + 1] || fallbackImage);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageGallery.length - 1 : prev - 1
    );
    setSelectedImage(imageGallery[currentImageIndex === 0 ? imageGallery.length - 1 : currentImageIndex - 1] || fallbackImage);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const renderStars = (rating = 4.8) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-white/30'}`}
        />
      );
    }
    return stars;
  };

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
      <div ref={containerRef} className="relative w-full max-w-6xl bg-gradient-to-br from-ocean/95 to-midnight/98 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden modal-content">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-20 rounded-full border border-white/20 bg-white/10 p-3 text-white/80 hover:text-white hover:bg-white/20 transition backdrop-blur-sm"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left: Image Gallery */}
          <div className="relative bg-gradient-to-br from-ocean/50 to-midnight/80 p-6 sm:p-8 lg:p-12">
            <div className="lg:sticky lg:top-8">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500"
                  onError={() => {
                    if (!imageError) {
                      setImageError(true);
                      setSelectedImage(fallbackImage);
                    }
                  }}
                />
                
                {/* Navigation Arrows */}
                {imageGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-gray-800 p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-gray-800 p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </>
                )}
                
                {product.badges && product.badges.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
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
              {imageGallery.length > 1 && (
                <div className="mt-6 grid grid-cols-4 gap-3">
                  {imageGallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setSelectedImage(img || fallbackImage);
                      }}
                      className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${
                        currentImageIndex === idx
                          ? 'border-brand-400 shadow-lg shadow-brand-400/30 ring-2 ring-brand-400/50'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={img || fallbackImage}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                      {currentImageIndex === idx && (
                        <div className="absolute inset-0 border-2 border-brand-400 rounded-xl" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-midnight/90 to-ocean/50">
            <div className="flex-1 space-y-6">
              {/* Category, Name, Rating & Wishlist */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-300 mb-2">
                    {product.category}
                  </p>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-3">{product.name}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(4.8)}
                    </div>
                    <span className="text-sm text-white/60">
                      4.8 (124 reviews)
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-brand-300 mb-2">{product.price}</p>
                  <span className="text-sm text-green-400">In stock</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-full transition-all ${
                    isWishlisted
                      ? 'text-red-500 bg-red-500/20'
                      : 'text-white/40 hover:text-red-500 hover:bg-white/10'
                  }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-white/10">
                <nav className="flex space-x-6" aria-label="Product information tabs">
                  {['description', 'details', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-brand-400 text-brand-300'
                          : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === 'description' && (
                  <div>
                    <p className="text-base leading-relaxed text-white/80 mb-4">{product.description}</p>
                    <h3 className="text-lg font-semibold text-white mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {[
                        'Premium quality materials',
                        'Free shipping on orders over $100',
                        '30-day return policy',
                        'Authenticity guaranteed'
                      ].map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                          <Check className="w-4 h-4 text-brand-300 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="text-white/70 space-y-2">
                    <p><strong className="text-white">Dimensions:</strong> Varies by size</p>
                    <p><strong className="text-white">Material:</strong> Premium quality materials</p>
                    <p><strong className="text-white">Care Instructions:</strong> Follow care label</p>
                    <p><strong className="text-white">Warranty:</strong> 30-day return policy</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-brand-300 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white">Free shipping</h3>
                        <p className="text-sm text-white/70">2-3 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-brand-300 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white">30-day returns</h3>
                        <p className="text-sm text-white/70">Hassle-free returns</p>
                      </div>
                    </div>
                  </div>
                )}
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

            {/* Quantity and Add to Cart */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-0 bg-transparent text-white focus:ring-0 text-base font-semibold"
                  />
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <Button 
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      handleAddToCart();
                    }
                  }}
                  className="flex-1 justify-center text-base py-3"
                  disabled={(requiresColorSelection && !selectedColor) || (requiresSizeSelection && !selectedSize)}
                >
                  Add to Cart ({quantity})
                </Button>
              </div>
              <Button variant="secondary" className="w-full justify-center text-base py-3">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

