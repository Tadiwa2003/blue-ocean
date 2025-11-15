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

gsap.registerPlugin(ScrollTrigger);

export function UserStorefront({ onClose, customStorefront }) {
  if (!customStorefront) {
    return null;
  }

  // Extract storefront configuration
  const storefrontName = customStorefront?.design?.branding?.storeName || customStorefront?.name || 'My Store';
  const storefrontTagline = customStorefront?.design?.branding?.tagline || '';
  const heroTitle = customStorefront?.design?.hero?.title || storefrontName;
  const heroSubtitle = customStorefront?.design?.hero?.subtitle || storefrontTagline;
  const primaryColor = customStorefront?.design?.colors?.primary || '#1da0e6';
  const secondaryColor = customStorefront?.design?.colors?.secondary || '#0b233e';
  const heroBackgroundColor = customStorefront?.design?.hero?.backgroundColor || secondaryColor;
  const heroBackgroundImage = customStorefront?.design?.hero?.backgroundImage || null;
  const storefrontType = customStorefront?.type || 'products';
  const storefrontId = customStorefront?._id || customStorefront?.id || null;

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
    return items.length > 0 ? items : [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    ];
  }, [storefrontType]);

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
            <h1 
              className="text-lg sm:text-xl font-display font-bold truncate"
              style={{ color: primaryColor }}
            >
              {storefrontName}
            </h1>
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
        className="relative py-20 sm:py-32 md:py-40 overflow-hidden"
        style={{
          backgroundColor: heroBackgroundColor,
          backgroundImage: heroBackgroundImage ? `url(${heroBackgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-6xl px-6 text-center z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4" style={{ color: primaryColor }}>
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
          {storefrontTagline && (
            <p className="mt-4 text-base text-white/70 max-w-xl mx-auto">
              {storefrontTagline}
            </p>
          )}
        </div>
      </section>

      {/* Products Section */}
      {(storefrontType === 'products' || storefrontType === 'mixed') && (
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
                      activeProductCategory === category
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/80'
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
      )}

      {/* Services Section */}
      {(storefrontType === 'spa' || storefrontType === 'mixed') && (
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
                      activeServiceCategory === category
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/80'
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
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onViewDetails={() => handleViewService(service)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

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

