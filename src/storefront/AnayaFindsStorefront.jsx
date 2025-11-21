import { useMemo, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProducts } from '../hooks/useProducts.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductDetailsModal } from '../components/ProductDetailsModal.jsx';
import { Cart } from '../components/Cart.jsx';
import { Checkout } from '../components/Checkout.jsx';
import { CartNotification } from '../components/CartNotification.jsx';
import { ContactModal } from '../components/ContactModal.jsx';
import { Button } from '../components/Button.jsx';
import { AnayaFindsLogo } from '../components/AnayaFindsLogo.jsx';
import { Phone } from 'lucide-react';
import { ContainerScrollAnimation } from '../components/ui/ScrollTriggerAnimations.jsx';
import DataGridHero from '../components/ui/DataGridHero.jsx';
import { motion } from 'framer-motion';
import ImageTrail from '../components/ui/ImageTrail.jsx';
import { SplineScene } from '../components/ui/spline.jsx';
import { Spotlight } from '../components/ui/spotlight.jsx';
import { Card } from '../components/ui/card.jsx';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_GRADIENT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojN2MzYTg1O3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNhNzhiZmE7c3RvcC1vcGFjaXR5OjAuNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2MjZkYTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

export function AnayaFindsStorefront({ onClose }) {
  // Anaya Finds branding - similar to BrightPath but with distinct colors
  const storefrontName = 'Anaya Finds';
  const storefrontTagline = 'Curated fashion finds for the modern wardrobe.';
  const heroTitle = 'Discover Your Style with Anaya Finds';
  const heroSubtitle = 'Premium Clothing & Fashion Essentials';
  const primaryColor = '#a78bfa'; // Purple accent (different from BrightPath's blue)
  const secondaryColor = '#7c3a85'; // Deep purple (different from BrightPath's midnight)
  const heroBackgroundColor = secondaryColor;

  // Enhanced color palette for Anaya Finds - more vibrant and fashion-forward
  const accentColor = '#a855f7'; // Bright purple accent
  const textColor = '#ffffff';
  const cardBackground = 'rgba(168, 85, 247, 0.15)'; // More vibrant purple with transparency
  const cardBorder = 'rgba(168, 85, 247, 0.35)'; // Stronger border definition
  const highlightColor = '#f472b6'; // Warm pink for highlights
  const gradientAccent = 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)'; // Fashion-forward gradient

  const paymentLogos = useMemo(
    () => ({
      visa: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="40" rx="10" fill="#1A1F71"/>
          <text x="60" y="24" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" text-anchor="middle">VISA</text>
        </svg>
      `)}`,
      mastercard: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="40" rx="10" fill="#FFFFFF"/>
          <circle cx="55" cy="20" r="14" fill="#EB001B" opacity="0.95"/>
          <circle cx="65" cy="20" r="14" fill="#F79E1B" opacity="0.9"/>
          <text x="60" y="35" fill="#1A1F71" font-family="Arial, Helvetica, sans-serif" font-size="10" letter-spacing="2" text-anchor="middle">MASTERCARD</text>
        </svg>
      `)}`,
      ecocash: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="40" rx="10" fill="#FFFFFF"/>
          <text x="20" y="26" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#0054A6">ECO</text>
          <text x="58" y="26" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#C9082A">CASH</text>
        </svg>
      `)}`,
      omari: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="40" rx="10" fill="#FFFFFF"/>
          <text x="60" y="24" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="700" fill="#4F2FA8">OMARI</text>
          <rect x="44" y="28" width="32" height="2" rx="1" fill="#4F2FA8" opacity="0.5"/>
        </svg>
      `)}`,
      innbucks: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="40" rx="10" fill="#FFFFFF"/>
          <text x="16" y="24" font-family="Arial Black, Helvetica, sans-serif" font-size="16" fill="#009245">INN</text>
          <text x="56" y="24" font-family="Arial Black, Helvetica, sans-serif" font-size="16" fill="#1C2C58">BUCKS</text>
        </svg>
      `)}`,
      onemoney: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="40" rx="10" fill="#FFFFFF"/>
          <text x="26" y="24" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#00AEEF">ONE</text>
          <text x="70" y="24" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#2E3192">MONEY</text>
        </svg>
      `)}`,
    }),
    [],
  );

  // Fetch products from backend - filter for clothing only
  const { products: allProducts, loading: productsLoading, error: productsError } = useProducts();
  
  // Filter for Clothing category only
  const productItems = useMemo(
    () => (allProducts || []).filter((p) => p.category === 'Clothing'),
    [allProducts]
  );

  const categoryCounts = useMemo(() => {
    return productItems.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
  }, [productItems]);

  const categories = useMemo(() => ['All', ...Object.keys(categoryCounts)], [categoryCounts]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredProducts = useMemo(
    () =>
      activeCategory === 'All'
        ? productItems
        : productItems.filter((p) => p.category === activeCategory),
    [activeCategory, productItems],
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when category changes
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  // Product details modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cart state - load from localStorage on mount
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('blueOceanCart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false });

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cartItems]);

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleViewRelatedProduct = (relatedProduct) => {
    setSelectedProduct(relatedProduct);
  };

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
      const variantText = [color, size].filter(Boolean).join(', ');
      const message = variantText 
        ? `Updated quantity: ${product.name} (${variantText})`
        : `Updated quantity: ${product.name}`;
      showNotification(message);
    } else {
      const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID().substring(0, 8)
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const cartId = `${product.id}-${color}-${size}-${uniqueId}`;
      const newItem = {
        cartId,
        ...product,
        color,
        size,
        quantity,
      };
      setCartItems((prev) => [...prev, newItem]);
      const variantText = [color, size].filter(Boolean).join(', ');
      const message = variantText 
        ? `Added to cart: ${product.name} (${variantText})`
        : `Added to cart: ${product.name}`;
      showNotification(message);
    }
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('blueOceanCart');
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
    showNotification('Cart cleared');
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('blueOceanCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product, color = '', size = '', quantity = 1) => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.color === color && item.size === size
      );

      if (existingItemIndex >= 0) {
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID().substring(0, 8)
          : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const cartId = `${product.id}-${color}-${size}-${uniqueId}`;
        const newItem = {
          cartId,
          ...product,
          color,
          size,
          quantity,
        };
        return [...prevItems, newItem];
      }
    });
    
    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 250);
  };

  const handleOrderComplete = (orderData) => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    try {
      localStorage.removeItem('blueOceanCart');
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
    showNotification(`Order ${orderData.orderId} placed successfully!`);
  };

  const showNotification = (message) => {
    setNotification({ message, isVisible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const handleContactAnayaFinds = () => {
    setIsContactOpen(true);
  };

  const handleCallOwner = () => {
    const phoneNumber = '+263710465531';
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleContactSuccess = (contactData) => {
    showNotification(`Thank you ${contactData.name}! Your message has been sent to our team via WhatsApp. We'll contact you shortly.`);
  };

  // Image trail items for background
  const imageTrailItems = useMemo(() => {
    return productItems.slice(0, 8).map((product) => ({
      id: product.id,
      image: product.image || FALLBACK_GRADIENT,
    }));
  }, [productItems]);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const productsSectionRef = useRef(null);
  const productsGridRef = useRef(null);

  // Hero text animations
  useEffect(() => {
    if (!heroRef.current) return;

    const hero = heroRef.current;
    gsap.fromTo(
      hero,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Animate hero text elements
    const heroTextElements = hero.querySelectorAll('.storefront-hero-text');
    gsap.fromTo(
      heroTextElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3,
      }
    );
  }, []);

  useEffect(() => {
    if (!productsGridRef.current || paginatedProducts.length === 0) return;

    const cards = productsGridRef.current.querySelectorAll('.storefront-card');
    const scrollTrigger = ScrollTrigger.create({
      trigger: productsGridRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      },
      once: true,
    });

    return () => {
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, [paginatedProducts]);

  const paymentChips = useMemo(
    () => [
      { name: 'Visa', logo: paymentLogos.visa, bgColor: 'bg-white/10', fallback: '💳' },
      { name: 'Mastercard', logo: paymentLogos.mastercard, bgColor: 'bg-white/10', fallback: '💳' },
      { name: 'EcoCash', logo: paymentLogos.ecocash, bgColor: 'bg-white/10', fallback: '💚' },
      { name: 'OMARI', logo: paymentLogos.omari, bgColor: 'bg-white/10', fallback: '💜' },
      { name: 'InnBucks', logo: paymentLogos.innbucks, bgColor: 'bg-white/10', fallback: '💵' },
      { name: 'OneMoney', logo: paymentLogos.onemoney, bgColor: 'bg-white/10', fallback: '💵' },
    ],
    [paymentLogos]
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
          <ImageTrail
            items={imageTrailItems}
            variant={1}
          />
        </div>
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at center, transparent 0%, rgba(124, 58, 133, 0.3) 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }} 
        />
      </div>
      
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl relative" style={{ backgroundColor: `${secondaryColor}cc` }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <AnayaFindsLogo className="h-10 w-10 sm:h-12 sm:w-12" showText={false} />
            <p className="hidden sm:flex text-sm uppercase tracking-[0.35em] font-semibold" style={{ color: primaryColor }}>Anaya Finds</p>
          </div>
          <p className="sm:hidden text-sm uppercase tracking-[0.35em] font-semibold" style={{ color: primaryColor }}>Anaya Finds</p>
          <div className="flex items-center gap-2 sm:gap-3 text-sm text-white/70 ml-auto">
            <span className="hidden sm:inline">Premium Clothing & Fashion</span>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full border border-white/20 bg-white/10 px-4 py-2 hover:bg-white/20 transition backdrop-blur-sm"
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: primaryColor }}>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
            <Button variant="secondary" onClick={onClose}>
              Exit Preview
            </Button>
          </div>
        </div>
      </header>

      <main className="pb-24 relative z-10">
        <section className="relative overflow-hidden min-h-[90vh] flex items-center" ref={heroRef}>
          {/* Enhanced animated background gradient */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-900/5 opacity-90 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800/10 via-purple-700/30 to-purple-800/5 opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-700/30 via-purple-600/40 to-purple-700/5 opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Spotlight effect */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            size={400}
          />

          {/* Hero Content Card with 3D Spline Scene */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="w-full min-h-[600px] bg-black/90 backdrop-blur-xl border-white/10 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
                {/* Left content */}
                <div className="flex-1 p-8 lg:p-12 relative z-10 flex flex-col justify-center">
                  <div className="storefront-hero-text mb-6" style={{ animationDelay: '0s' }}>
                    <AnayaFindsLogo className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 mb-6" showText={false} />
                  </div>
                  <span className="storefront-hero-text inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white mb-4">
                    {heroSubtitle}
                  </span>
                  <h1 className="storefront-hero-text font-luxury text-4xl md:text-5xl lg:text-6xl leading-tight text-white mb-4" style={{ animationDelay: '0.2s' }}>
                    {heroTitle}
                  </h1>
                  <p className="storefront-hero-text max-w-lg text-base md:text-lg text-white/90 mb-8 font-elegant" style={{ animationDelay: '0.4s' }}>
                    ✨ Discover curated fashion pieces, premium clothing, and style essentials. Each piece is carefully selected to elevate your wardrobe with confidence and elegance.
                  </p>
                  <div className="storefront-hero-text flex flex-wrap gap-3" style={{ animationDelay: '0.6s' }}>
                    <Button
                      onClick={() => {
                        if (productsSectionRef.current) {
                          productsSectionRef.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }}
                      style={{ backgroundColor: primaryColor }}
                      className="px-8 py-3 text-lg"
                    >
                      Shop Clothing
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleContactAnayaFinds}
                      className="px-8 py-3 text-lg border-white/20 text-white hover:bg-white/10"
                    >
                      Contact Us
                    </Button>
                  </div>
                </div>

                {/* Right content - 3D Spline Scene with Logo */}
                <div className="flex-1 relative min-h-[400px] lg:min-h-[600px] bg-transparent">
                  <SplineScene 
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative" style={{ transform: 'translateY(-20%)' }}>
                      <AnayaFindsLogo className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48" showText={false} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section ref={productsSectionRef} className="mx-auto mt-20 max-w-7xl px-6">
          <div className="flex flex-col gap-8 text-left">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: primaryColor }}>Fashion Collection</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-white">Shop the {storefrontName} Collection</h2>
              </div>
              <p className="text-sm leading-relaxed text-white/65 sm:max-w-md">
                Browse our curated selection of premium clothing and fashion essentials.
              </p>
            </div>

            {/* Browse / Filter Bar */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-6 backdrop-blur-md shadow-xl">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: `${primaryColor}20` }} />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full blur-2xl" style={{ backgroundColor: `${primaryColor}15` }} />
              
              <div className="relative mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg" style={{ background: `linear-gradient(135deg, ${primaryColor}33, ${primaryColor}22)` }}>
                  <svg className="h-5 w-5" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Browse Clothing</h3>
                  <p className="text-xs text-white/50">Select a category to filter</p>
                </div>
              </div>
              
              <div className="no-scrollbar relative -mx-2 flex gap-3 overflow-x-auto px-2 pb-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count = cat === 'All' ? productItems.length : (categoryCounts[cat] || 0);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={[
                        'group relative inline-flex min-w-fit items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300',
                        isActive
                          ? 'text-white shadow-lg'
                          : 'border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white',
                      ].join(' ')}
                      style={isActive ? {
                        borderColor: `${primaryColor}cc`,
                        background: gradientAccent,
                        boxShadow: `0 8px 30px ${primaryColor}50, 0 4px 15px ${highlightColor}30`
                      } : {}}
                    >
                      {isActive && (
                        <div className="absolute inset-0 -z-10 rounded-2xl blur-lg" style={{ backgroundColor: `${primaryColor}30` }} />
                      )}
                      <span className="text-base opacity-80">👕</span>
                      <span className="whitespace-nowrap">{cat}</span>
                      <span
                        className={[
                          'inline-flex min-w-[2rem] items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
                          isActive 
                            ? 'bg-white/25 text-white' 
                            : 'bg-white/10 text-white/60 group-hover:bg-white/15 group-hover:text-white/80',
                        ].join(' ')}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filtered Grid */}
          <div ref={productsGridRef} className="relative mt-10">
            <div className="absolute inset-0 -z-10">
              <DataGridHero
                rows={30}
                cols={40}
                spacing={6}
                duration={5.0}
                color={primaryColor}
                animationType="pulse"
                pulseEffect={true}
                mouseGlow={true}
                opacityMin={0.3}
                opacityMax={0.8}
                background="transparent"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr relative z-10" style={{ perspective: '1000px' }}>
            {productsLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: primaryColor }}></div>
                <p className="text-white/60">Loading clothing...</p>
              </div>
            ) : productsError ? (
              <div className="col-span-full rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                <p className="text-red-200 font-semibold">Error loading products</p>
                <p className="mt-2 text-sm text-red-200/70">{productsError}</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-white/60">No clothing items found in this category.</p>
              </div>
            ) : (
              paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="storefront-card"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewProductDetails}
                    onAddToCart={(product) => addToCart(product)}
                    theme={{
                      card: {
                        background: cardBackground,
                        border: cardBorder,
                        shadow: `0 20px 60px ${primaryColor}40, 0 10px 30px ${highlightColor}20`,
                      },
                      accent: primaryColor,
                    }}
                  />
                </motion.div>
              ))
            )}
            </div>
          </div>

          {/* Pagination */}
          {!productsLoading && !productsError && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={[
                  'group flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold transition-all duration-300',
                  currentPage === 1
                    ? 'cursor-not-allowed border-white/5 bg-white/5 text-white/30'
                    : 'border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>

              <div className="relative overflow-hidden rounded-2xl border px-6 py-3 backdrop-blur" style={{ borderColor: `${primaryColor}60`, background: gradientAccent, boxShadow: `0 8px 25px ${primaryColor}30` }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Page</span>
                  <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-white/25 px-2 text-sm font-bold text-white shadow-lg">
                    {currentPage}
                  </span>
                  <span className="text-sm text-white/80">of</span>
                  <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-white/15 px-2 text-sm font-bold text-white/90">
                    {totalPages}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-1.5">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(currentPage / totalPages) * 100}%`,
                      background: `linear-gradient(90deg, ${primaryColor}, #c084fc)`
                    }}
                  />
                </div>
                <p className="text-center text-xs text-white/50">
                  {paginatedProducts.length} of {filteredProducts.length} items
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={[
                  'group flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold transition-all duration-300',
                  currentPage === totalPages
                    ? 'cursor-not-allowed border-white/5 bg-white/5 text-white/30'
                    : 'border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                <span>Next</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </section>

        {/* Ready to Shop CTA */}
        <section className="mx-auto mt-20 max-w-5xl rounded-[36px] border border-white/10 px-8 py-12 text-center backdrop-blur-sm" style={{ background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}15)` }}>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: primaryColor }}>Fashion Forward</p>
            <h3 className="font-display text-3xl text-white">Ready to elevate your style?</h3>
          </div>
          <p className="mt-4 text-base text-white/80">
            Discover premium clothing pieces curated for the modern wardrobe. Each item is selected for quality, style, and versatility.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button onClick={handleContactAnayaFinds} style={{ backgroundColor: primaryColor }}>Contact Anaya Finds</Button>
            <Button variant="secondary" onClick={handleCallOwner} icon={Phone}>
              Call: +263 71 046 5531
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/10" style={{ backgroundColor: `${secondaryColor}cc` }}>
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-4">
            <div>
              <div className="text-3xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                <span>AF</span>
                <span className="text-xs font-normal text-white/60">✨</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Anaya Finds curates premium clothing and fashion essentials for the modern wardrobe. Discover your style with confidence.
              </p>
              <div className="mt-6 flex gap-3">
                {['𝕏', '◦', '𝕏'].map((icon) => (
                  <span
                    key={icon}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70"
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Shop</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Clothing Collection</li>
                <li>New Arrivals</li>
                <li>Best Sellers</li>
                <li>Sale Items</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Contact Us</li>
                <li>Shipping & Returns</li>
                <li>Size Guide</li>
                <li>FAQ</li>
              </ul>
            </div>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: primaryColor }}>
                Newsletter
              </h4>
              <p className="text-sm text-white/70">
                Stay updated on new arrivals, exclusive offers, and fashion tips.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none backdrop-blur focus:border-white/20 transition"
                />
                <Button type="submit" className="whitespace-nowrap" style={{ backgroundColor: primaryColor }}>
                  Join
                </Button>
              </div>
            </form>
          </div>
          <div className="border-t border-white/5">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
              <div className="no-scrollbar -mx-2 flex flex-wrap items-center gap-3 overflow-x-auto px-2">
                {paymentChips.map((p, idx) => (
                  <span
                    key={p.name}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur transition-all duration-300"
                    style={{
                      animationDelay: `${idx * 0.1}s`,
                    }}
                    title={p.name}
                  >
                    <img
                      src={p.logo}
                      alt={`${p.name} logo`}
                      className="h-8 w-auto object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        const fallback = parent?.querySelector('[data-fallback]');
                        if (fallback) {
                          fallback.classList.remove('hidden');
                          fallback.classList.add('inline-flex');
                        }
                      }}
                    />
                    <span className="hidden items-center gap-2 text-base text-ocean/80" data-fallback>
                      {p.fallback ? `${p.fallback} ${p.name}` : p.name}
                    </span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/50">
                © {new Date().getFullYear()} Anaya Finds · All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        open={isModalOpen}
        onClose={handleCloseModal}
        onViewProduct={handleViewRelatedProduct}
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cart */}
      <Cart
        cartItems={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout */}
      <Checkout
        cartItems={cartItems}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onSuccess={handleContactSuccess}
      />

      {/* Cart Notification */}
      <CartNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ message: '', isVisible: false })}
      />
    </ContainerScrollAnimation>
  );
}

