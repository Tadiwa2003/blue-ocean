import { useMemo, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProducts } from '../hooks/useProducts.js';
import { useServices } from '../hooks/useServices.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ServiceCard } from '../components/ServiceCard.jsx';
import { ProductDetailsModal } from '../components/ProductDetailsModal.jsx';
import { ServiceDetailsModal } from '../components/ServiceDetailsModal.jsx';
import { Cart } from '../components/Cart.jsx';
import { Checkout } from '../components/Checkout.jsx';
import { CartNotification } from '../components/CartNotification.jsx';
import { ContactModal } from '../components/ContactModal.jsx';
import { Button } from '../components/Button.jsx';
import { X, ShoppingBag, Phone } from 'lucide-react';
import { ContainerScrollAnimation } from '../components/ui/ScrollTriggerAnimations.jsx';
import ImageTrail from '../components/ui/ImageTrail.jsx';
import { motion } from 'framer-motion';

const THEME_PRESETS = [
  {
    id: 'aurora',
    focus: 'beauty',
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.95), rgba(79,70,229,0.9))',
    accent: '#8B5CF6',
    texture: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 50%)',
    glow: 'rgba(91, 33, 182, 0.35)',
    badge: 'Aurora Glow',
    highlights: ['Hand-crafted drops', 'Ethical sourcing', 'Instant onboarding'],
    card: {
      background: 'rgba(21,30,61,0.8)',
      border: 'rgba(255,255,255,0.12)',
      shadow: '0 20px 60px rgba(79,70,229,0.25)',
    },
  },
  {
    id: 'tidepool',
    focus: 'wellness',
    gradient: 'linear-gradient(135deg, rgba(8,145,178,0.95), rgba(6,78,59,0.92))',
    accent: '#10B981',
    texture: 'radial-gradient(circle at 80% 0%, rgba(16,185,129,0.2), transparent 55%)',
    glow: 'rgba(13, 148, 136, 0.35)',
    badge: 'Tidepool Calm',
    highlights: ['Wellness rituals', 'Seasonal curations', 'Private events'],
    card: {
      background: 'rgba(4,44,57,0.85)',
      border: 'rgba(16,185,129,0.15)',
      shadow: '0 20px 60px rgba(13,148,136,0.25)',
    },
  },
  {
    id: 'ember',
    focus: 'artisan',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(249,115,22,0.92))',
    accent: '#F97316',
    texture: 'radial-gradient(circle at 30% 80%, rgba(251,191,36,0.25), transparent 55%)',
    glow: 'rgba(253, 186, 116, 0.3)',
    badge: 'Ember Luxe',
    highlights: ['Drop shipping ready', 'Premium packaging', 'Same-day prep'],
    card: {
      background: 'rgba(56,32,8,0.9)',
      border: 'rgba(249,115,22,0.2)',
      shadow: '0 20px 60px rgba(249,115,22,0.3)',
    },
  },
];

const FOCUS_LABELS = {
  beauty: 'Beauty & Spa',
  wellness: 'Wellness & Retreats',
  artisan: 'Artisan Goods',
  tech: 'Tech & Lifestyle',
  lifestyle: 'Lifestyle Boutique',
};

const FOCUS_THEME_MAP = {
  beauty: 'aurora',
  wellness: 'tidepool',
  artisan: 'ember',
  tech: 'aurora',
  lifestyle: 'aurora',
};

const stringHash = (value = '') => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

gsap.registerPlugin(ScrollTrigger);

export function UserStorefront({ onClose, customStorefront }) {
  if (!customStorefront) {
    return null;
  }

  // Extract storefront configuration
  const storefrontName = customStorefront?.design?.branding?.storeName || customStorefront?.name || 'My Store';
  const storefrontTagline = customStorefront?.design?.branding?.tagline || '';
  const storefrontLogo = customStorefront?.design?.branding?.logo || null;
  const heroTitle = customStorefront?.design?.hero?.title || storefrontName;
  const heroSubtitle = customStorefront?.design?.hero?.subtitle || storefrontTagline;
  const primaryColor = customStorefront?.design?.colors?.primary || '#1da0e6';
  const secondaryColor = customStorefront?.design?.colors?.secondary || '#0b233e';
  const heroBackgroundColor = customStorefront?.design?.hero?.backgroundColor || secondaryColor;
  const heroBackgroundImage = customStorefront?.design?.hero?.backgroundImage || null;
  const storefrontType = customStorefront?.type || 'products';
  const storefrontId = customStorefront?._id || customStorefront?.id || null;
  const focusKey =
    customStorefront?.design?.focus ||
    (storefrontType === 'spa' ? 'wellness' : storefrontType === 'products' ? 'artisan' : 'beauty');

  const selectedTheme = useMemo(() => {
    const presetFromFocus = FOCUS_THEME_MAP[focusKey];
    const explicitThemeId = customStorefront?.design?.themePreset;
    if (explicitThemeId) {
      return THEME_PRESETS.find((theme) => theme.id === explicitThemeId) ?? THEME_PRESETS[0];
    }
    if (presetFromFocus) {
      const focusTheme = THEME_PRESETS.find((theme) => theme.id === presetFromFocus);
      if (focusTheme) return focusTheme;
    }
    const index = storefrontId ? stringHash(storefrontId) % THEME_PRESETS.length : 0;
    return THEME_PRESETS[index];
  }, [customStorefront, storefrontId, focusKey]);

  const gradientAccent = customStorefront?.design?.colors?.gradient || selectedTheme.gradient;
  const badgeLabel = customStorefront?.design?.branding?.badge || selectedTheme.badge;
  const brandHighlights =
    customStorefront?.design?.branding?.pillars?.length > 0
      ? customStorefront.design.branding.pillars
      : selectedTheme.highlights;
  const experienceLabel = FOCUS_LABELS[focusKey] || 'Online Boutique';
  const cardTheme = {
    card: selectedTheme.card,
    accent: customStorefront?.design?.colors?.accent || selectedTheme.accent,
  };
  const showProducts = storefrontType === 'products' || storefrontType === 'mixed';
  const showServices = storefrontType === 'spa' || storefrontType === 'mixed';
  const servicesFirst = showServices && (focusKey === 'beauty' || focusKey === 'wellness' || storefrontType === 'spa');

  // Fetch data based on storefront type - filter by storefrontId
  const { products: allProducts, loading: productsLoading } = useProducts(storefrontId);
  const { services: allServices, loading: servicesLoading } = useServices(storefrontId);

  // Products and services are already filtered by storefrontId from the API
  // Just filter by storefront type for display
  const productItems = useMemo(() => {
    if (storefrontType === 'products' || storefrontType === 'mixed') {
      return (allProducts || []).filter((p) => p.category !== 'Beauty Spa Services');
    }
    return [];
  }, [allProducts, storefrontType]);

  const serviceItems = useMemo(() => {
    if (storefrontType === 'spa' || storefrontType === 'mixed') {
      return allServices || [];
    }
    return [];
  }, [allServices, storefrontType]);

  // Category management
  const productCategories = useMemo(() => {
    const cats = new Set();
    productItems.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [productItems]);

  const serviceCategories = useMemo(() => {
    const cats = new Set();
    serviceItems.forEach((s) => {
      if (s.serviceCategory) cats.add(s.serviceCategory);
    });
    return ['All', ...Array.from(cats)];
  }, [serviceItems]);

  const [activeProductCategory, setActiveProductCategory] = useState('All');
  const [activeServiceCategory, setActiveServiceCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtered items
  const filteredProducts = useMemo(() => {
    if (activeProductCategory === 'All') return productItems;
    return productItems.filter((p) => p.category === activeProductCategory);
  }, [activeProductCategory, productItems]);

  const filteredServices = useMemo(() => {
    if (activeServiceCategory === 'All') return serviceItems;
    return serviceItems.filter((s) => s.serviceCategory === activeServiceCategory);
  }, [activeServiceCategory, serviceItems]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false });

  // Cart state
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('userStorefrontCart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('userStorefrontCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Image trail items
  const imageTrailItems = useMemo(() => {
    if (customStorefront?.design?.gallery?.length) {
      return customStorefront.design.gallery;
    }
    const items = [];
    if (storefrontType === 'products' || storefrontType === 'mixed') {
      items.push(
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
      );
    }
    if (storefrontType === 'spa' || storefrontType === 'mixed') {
      items.push(
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=400&fit=crop',
      );
    }
    return items.length > 0
      ? items
      : ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop'];
  }, [customStorefront, storefrontType]);

  const lookbookImages = useMemo(() => {
    if (customStorefront?.design?.lookbook?.length) {
      return customStorefront.design.lookbook;
    }
    return imageTrailItems.slice(0, 4);
  }, [customStorefront, imageTrailItems]);

  // Cart functions
  const addToCart = (product, color = '', size = '', quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.color === color && item.size === size
    );

    if (existingItemIndex >= 0) {
      setCartItems((prev) =>
        prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...product,
          color,
          size,
          quantity,
        },
      ]);
    }
    showNotification(`Added ${product.name} to cart`);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const showNotification = (message) => {
    setNotification({ message, isVisible: true });
    setTimeout(() => {
      setNotification({ message: '', isVisible: false });
    }, 3000);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const productsSection = (
    <section className="relative z-10 py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center">Products</h2>

        {/* Category Filter */}
        {productCategories.length > 1 && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {productCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveProductCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeProductCategory === category ? 'text-white' : 'text-white/60 hover:text-white/80'
                }`}
                style={{
                  backgroundColor: activeProductCategory === category ? primaryColor : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-12 text-white/60">Loading products...</div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12 text-white/60">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => handleViewProduct(product)}
                onAddToCart={addToCart}
                theme={cardTheme}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: currentPage === 1 ? 'rgba(255, 255, 255, 0.1)' : primaryColor,
                color: 'white',
              }}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-white/80">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: currentPage === totalPages ? 'rgba(255, 255, 255, 0.1)' : primaryColor,
                color: 'white',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );

  const servicesSection = (
    <section className="relative z-10 py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center">Services</h2>

        {/* Category Filter */}
        {serviceCategories.length > 1 && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {serviceCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveServiceCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeServiceCategory === category ? 'text-white' : 'text-white/60 hover:text-white/80'
                }`}
                style={{
                  backgroundColor: activeServiceCategory === category ? primaryColor : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {servicesLoading ? (
          <div className="text-center py-12 text-white/60">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12 text-white/60">No services found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} onViewDetails={() => handleViewService(service)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <ContainerScrollAnimation className="min-h-screen bg-midnight text-white relative">
      {/* Image Trail Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      >
        <div style={{
          pointerEvents: 'auto',
          height: '100%',
          width: '100%',
          position: 'relative'
        }}>
          <ImageTrail items={imageTrailItems} variant={1} />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(11, 35, 62, 0.3) 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl relative"
        style={{ backgroundColor: `${secondaryColor}CC` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            {storefrontLogo ? (
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  {/* Glow effect behind logo */}
                  <div
                    className="absolute inset-0 rounded-xl blur-md opacity-40"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <img
                    src={storefrontLogo}
                    alt={storefrontName}
                    className="relative h-10 w-auto max-w-[120px] object-contain"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.style.display = 'none';
                      }
                    }}
                  />
                </div>
                {/* Show store name alongside logo if available */}
                {storefrontName && (
                  <h1
                    className="text-lg sm:text-xl font-display font-bold truncate"
                    style={{ color: primaryColor }}
                  >
                    {storefrontName}
                  </h1>
                )}
              </div>
            ) : (
              <h1
                className="text-lg sm:text-xl font-display font-bold truncate"
                style={{ color: primaryColor }}
              >
                {storefrontName}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            {(storefrontType === 'products' || storefrontType === 'mixed') && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close storefront"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative py-32 sm:py-48 md:py-64 overflow-hidden"
        style={{
          backgroundColor: heroBackgroundColor,
        }}
      >
        {/* High-Quality Background Image with Parallax */}
        {heroBackgroundImage ? (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${heroBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed', // Parallax effect
              imageRendering: 'high-quality',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              willChange: 'transform',
            }}
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${heroBackgroundColor} 0%, ${primaryColor}22 100%)`,
            }}
          />
        )}

        {/* Animated Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"
          style={{
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />

        {/* Subtle Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Content Container with Fade-in Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mx-auto max-w-6xl px-6 text-center z-10"
        >
          {/* Storefront Logo in Hero */}
          {storefrontLogo && customStorefront?.design?.hero?.showLogo !== false && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative inline-flex items-center justify-center">
                {/* Multi-layer glow effect */}
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-30"
                  style={{
                    backgroundColor: primaryColor,
                    transform: 'scale(1.2)'
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-20"
                  style={{
                    backgroundColor: primaryColor,
                    transform: 'scale(1.1)'
                  }}
                />

                {/* Logo container with background */}
                <div
                  className="relative px-8 py-6 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at center, ${primaryColor}15, transparent 70%)`,
                  }}
                >
                  <img
                    src={storefrontLogo}
                    alt={storefrontName}
                    className="h-24 sm:h-28 md:h-32 lg:h-36 w-auto object-contain mx-auto"
                    style={{
                      maxHeight: customStorefront?.design?.hero?.logoSize === 'small' ? '96px' :
                        customStorefront?.design?.hero?.logoSize === 'large' ? '160px' : '128px',
                      maxWidth: '100%',
                      filter: `drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4)) drop-shadow(0 4px 8px ${primaryColor}40)`,
                      imageRendering: 'high-quality',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement?.parentElement;
                      if (parent) {
                        parent.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Title with Glow Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 drop-shadow-2xl"
            style={{
              color: '#ffffff',
              textShadow: `0 0 40px ${primaryColor}80, 0 0 80px ${primaryColor}40, 0 4px 20px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {heroTitle}
          </motion.h1>

          {/* Subtitle with Slide-in Animation */}
          {heroSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg"
            >
              {heroSubtitle}
            </motion.p>
          )}

          {/* Tagline with Fade-in */}
          {storefrontTagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            >
              {storefrontTagline}
            </motion.p>
          )}

          {/* Decorative Element */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 mx-auto w-24 h-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
              boxShadow: `0 0 20px ${primaryColor}80`,
            }}
          />
        </motion.div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${primaryColor}60, transparent)`,
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </section>

      {/* Products Section */}
      {(storefrontType === 'products' || storefrontType === 'mixed') && (
        <section className="relative z-10 py-16 px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center">Products</h2>

            {/* Category Filter - Premium Design */}
            {productCategories.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                {/* Section Header */}
                <div className="text-center mb-8">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-semibold text-white/90 mb-2"
                  >
                    Browse by Category
                  </motion.h3>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mx-auto w-16 h-0.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
                    }}
                  />
                </div>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
                  {productCategories.map((category, index) => {
                    const isActive = activeProductCategory === category;
                    const isAll = category === 'All';

                    return (
                      <motion.button
                        key={category}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveProductCategory(category);
                          setCurrentPage(1);
                        }}
                        className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
                        style={{
                          background: isActive
                            ? `linear-gradient(135deg, ${primaryColor}E6 0%, ${primaryColor}B3 100%)`
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                          border: isActive
                            ? `2px solid ${primaryColor}`
                            : '2px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: isActive
                            ? `0 8px 32px ${primaryColor}40, 0 0 0 1px ${primaryColor}20 inset`
                            : '0 4px 16px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {/* Glow Effect on Hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at center, ${primaryColor}30, transparent 70%)`,
                            filter: 'blur(20px)',
                          }}
                        />

                        {/* Shimmer Effect */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                            backgroundSize: '200% 200%',
                            animation: 'shimmer 2s infinite',
                          }}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center gap-3">
                          {/* Icon */}
                          <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110"
                            style={{
                              background: isActive
                                ? 'rgba(255, 255, 255, 0.2)'
                                : 'rgba(255, 255, 255, 0.1)',
                              boxShadow: isActive
                                ? `0 4px 12px ${primaryColor}40`
                                : '0 2px 8px rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            {isAll ? (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            )}
                          </div>

                          {/* Category Name */}
                          <span
                            className="text-sm font-semibold text-center leading-tight transition-colors duration-300"
                            style={{
                              color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            {category}
                          </span>

                          {/* Active Indicator */}
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
                                boxShadow: `0 2px 8px ${primaryColor}60`,
                              }}
                            >
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </div>

                        {/* Bottom Accent Line */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
                          style={{
                            background: isActive
                              ? `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`
                              : 'transparent',
                            opacity: isActive ? 1 : 0,
                          }}
                        />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Category Count Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-6"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} in {activeProductCategory}
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* Products Grid */}
            {productsLoading ? (
              <div className="text-center py-12 text-white/60">Loading products...</div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-12 text-white/60">No products found in this category.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={() => handleViewProduct(product)}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            className="rounded-[32px] border border-white/10 p-6 text-white relative overflow-hidden"
            style={{ background: gradientAccent }}
          >
            <div className="relative z-10 space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">Drop Status</p>
              <h4 className="text-2xl font-display">{customStorefront?.design?.hero?.collectionName || 'Signature Capsule'}</h4>
              <p className="text-sm text-white/80">
                {customStorefront?.design?.hero?.collectionDescription ||
                  'Limited-production pieces refreshed weekly. Built for online-only experiences.'}
              </p>
              <div className="flex items-center justify-between pt-2 text-sm text-white/80">
                <span>Live inventory sync</span>
                <span className="font-mono text-base text-white">ON</span>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2 opacity-30">
              <div className="h-full w-full" style={{ backgroundImage: selectedTheme.texture }} />
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook / capsule */}
      {lookbookImages.length > 0 && (
        <section className="relative z-10 px-6 pb-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center">Services</h2>

            {/* Category Filter */}
            {serviceCategories.length > 1 && (
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {serviceCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveServiceCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeServiceCategory === category
                      ? 'text-white'
                      : 'text-white/60 hover:text-white/80'
                      }`}
                    style={{
                      backgroundColor: activeServiceCategory === category ? primaryColor : 'rgba(255, 255, 255, 0.1)',
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <p className="text-sm uppercase tracking-[0.4em] text-white/70">Drop {index + 1}</p>
                    <p className="text-lg font-semibold">{customStorefront?.design?.hero?.title || storefrontName}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products/Services placement */}
      {showProducts && !servicesFirst && productsSection}
      {showServices && servicesSection}
      {showProducts && servicesFirst && productsSection}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6 mt-16">
        <div className="mx-auto max-w-6xl text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} {storefrontName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      {isProductModalOpen && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
          onAddToCart={addToCart}
        />
      )}

      {isServiceModalOpen && selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          onClose={() => {
            setIsServiceModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}

      {isCartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {isCheckoutOpen && (
        <Checkout
          items={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            setCartItems([]);
            setIsCheckoutOpen(false);
            showNotification('Order placed successfully!');
          }}
        />
      )}

      {isContactOpen && (
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          onSuccess={() => {
            setIsContactOpen(false);
            showNotification('Message sent successfully!');
          }}
        />
      )}

      <CartNotification message={notification.message} isVisible={notification.isVisible} />
    </ContainerScrollAnimation>
  );
}
