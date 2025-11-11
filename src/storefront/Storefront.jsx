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
import { Logo } from '../components/Logo.jsx';
import { Phone } from 'lucide-react';
import { ContainerScrollAnimation } from '../components/ui/ScrollTriggerAnimations.jsx';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_GRADIENT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGIyMzNlO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZGEwZTY7c3RvcC1vcGFjaXR5OjAuNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzA0MGIxODtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

export function Storefront({ onClose }) {
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
  // Fetch products from backend
  const { products: allProducts, loading: productsLoading, error: productsError } = useProducts();
  
  // Filter out Beauty Spa Services - this is for products only
  const productItems = useMemo(
    () => (allProducts || []).filter((p) => p.category !== 'Beauty Spa Services'),
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

  // Storefront preferences
  const [currency, setCurrency] = useState('ZWG $');
  const [language, setLanguage] = useState('English');
  
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

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleViewRelatedProduct = (relatedProduct) => {
    // Close current modal and open new one with related product
    setSelectedProduct(relatedProduct);
    // Modal state stays open, just change the product
  };

  // Cart functions
  const addToCart = (product, color = '', size = '') => {
    // Check if item with same product ID, color, and size already exists
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.color === color && item.size === size
    );

    if (existingItemIndex >= 0) {
      // Item exists, increment quantity
      setCartItems((prev) =>
        prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      const variantText = [color, size].filter(Boolean).join(', ');
      const message = variantText 
        ? `Updated quantity: ${product.name} (${variantText})`
        : `Updated quantity: ${product.name}`;
      showNotification(message);
    } else {
      // New item, add to cart
      const cartId = `${product.id}-${color}-${size}-${Date.now()}`;
      const newItem = {
        cartId,
        ...product,
        color,
        size,
        quantity: 1,
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
    // Clear cart from localStorage
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

  const handleOrderComplete = (orderData) => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    // Clear cart from localStorage after successful order
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

  const handleContactBlueOcean = () => {
    setIsContactOpen(true);
  };

  const handleCallOwner = () => {
    const phoneNumber = '+263710465531';
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleContactSuccess = (contactData) => {
    showNotification(`Thank you ${contactData.name}! Your message has been sent to our team via WhatsApp. We'll contact you shortly.`);
  };

  const handleDownloadLineSheet = () => {
    showNotification('Preparing line sheet download...');
    
    setTimeout(() => {
      // Helper function to escape HTML
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };

      // Group products by category
      const productsByCategory = productItems.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});

      // Create beautifully designed HTML line sheet
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blue Ocean Capsule - Line Sheet 2026</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: A4;
      margin: 1cm;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #0b233e;
      background: #ffffff;
      padding: 40px;
    }
    
    .header {
      background: linear-gradient(135deg, #0b233e 0%, #1da0e6 100%);
      color: white;
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 40px;
      box-shadow: 0 10px 40px rgba(11, 35, 62, 0.2);
    }
    
    .header h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .header p {
      font-size: 16px;
      opacity: 0.95;
      font-weight: 300;
    }
    
    .header .subtitle {
      margin-top: 12px;
      font-size: 14px;
      opacity: 0.85;
    }
    
    .contact-info {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 40px;
      border-left: 4px solid #1da0e6;
    }
    
    .contact-info h3 {
      color: #0b233e;
      font-size: 18px;
      margin-bottom: 12px;
    }
    
    .contact-info p {
      color: #4a5568;
      font-size: 14px;
      margin: 4px 0;
    }
    
    .category-section {
      margin-bottom: 50px;
      page-break-inside: avoid;
    }
    
    .category-header {
      background: linear-gradient(135deg, #1da0e6 0%, #0b233e 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 8px 8px 0 0;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 24px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    
    .product-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.3s ease;
      page-break-inside: avoid;
    }
    
    .product-card:hover {
      box-shadow: 0 8px 24px rgba(29, 160, 230, 0.15);
      border-color: #1da0e6;
    }
    
    .product-name {
      font-size: 18px;
      font-weight: 600;
      color: #0b233e;
      margin-bottom: 8px;
    }
    
    .product-price {
      font-size: 24px;
      font-weight: 700;
      color: #1da0e6;
      margin-bottom: 12px;
    }
    
    .product-description {
      font-size: 14px;
      color: #4a5568;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    
    .product-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    
    .badge {
      background: #e6f7ff;
      color: #1da0e6;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #718096;
      font-size: 14px;
    }
    
    .footer p {
      margin: 8px 0;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .header {
        page-break-after: avoid;
      }
      
      .category-section {
        page-break-inside: avoid;
      }
      
      .product-card {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Blue Ocean Capsule</h1>
    <p>Resort 2026 Collection</p>
    <p class="subtitle">Curated coastal luxury for people who live and shop by the tides</p>
  </div>
  
  <div class="contact-info">
    <h3>Partnership & Ordering Information</h3>
    <p><strong>Email:</strong> partnerships@blueocean.co</p>
    <p><strong>Website:</strong> www.blueocean.co</p>
    <p><strong>Collection:</strong> Resort 2026</p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  ${Object.entries(productsByCategory).map(([category, products]) => `
    <div class="category-section">
      <div class="category-header">${escapeHtml(category)}</div>
      <div class="products-grid">
        ${products.map(product => `
          <div class="product-card">
            <div class="product-name">${escapeHtml(product.name)}</div>
            <div class="product-price">${escapeHtml(product.price)}</div>
            <div class="product-description">${escapeHtml(product.description || '')}</div>
            ${product.badges && product.badges.length > 0 ? `
              <div class="product-badges">
                ${product.badges.map(badge => `<span class="badge">${escapeHtml(badge)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}

  <div class="footer">
    <p><strong>Blue Ocean Capsule</strong></p>
    <p>Curated coastal-luxury products and spa services for resort retailers and boutique partners.</p>
    <p>© ${new Date().getFullYear()} Blue Ocean. All rights reserved.</p>
  </div>
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Blue-Ocean-Line-Sheet-2026.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('Line sheet downloaded successfully!');
    }, 500);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const paymentChips = useMemo(
    () => [
      { name: 'VISA', logo: paymentLogos.visa, color: 'from-blue-600/20', bgColor: 'bg-white/95' },
      { name: 'Mastercard', logo: paymentLogos.mastercard, color: 'from-orange-600/20', bgColor: 'bg-white/95' },
      { name: 'EcoCash', logo: paymentLogos.ecocash, color: 'from-yellow-600/20', bgColor: 'bg-white/95', fallback: '💸' },
      { name: 'OMARI', logo: paymentLogos.omari, color: 'from-purple-600/20', bgColor: 'bg-white/95', fallback: '🏦' },
      { name: 'Innbucks', logo: paymentLogos.innbucks, color: 'from-green-600/20', bgColor: 'bg-white/95', fallback: '💰' },
      { name: 'One Money', logo: paymentLogos.onemoney, color: 'from-pink-600/20', bgColor: 'bg-white/95', fallback: '📱' },
    ],
    [paymentLogos],
  );

  // Parallax effect for hero section
  const heroRef = useRef(null);
  const productsGridRef = useRef(null);
  const productsSectionRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const heroTop = rect.top + scrolled;
        const heroHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // Only apply parallax when hero is in viewport
        if (scrolled < heroTop + heroHeight && scrolled + windowHeight > heroTop) {
          const parallax = (scrolled - heroTop) * 0.3;
          heroRef.current.style.transform = `translateY(${parallax}px)`;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animations for products grid
  useEffect(() => {
    if (!productsGridRef.current) return;

    const cards = productsGridRef.current.querySelectorAll('.storefront-card');
    if (cards.length === 0) return;

    // Store event listeners for cleanup
    const hoverHandlers = [];

    // Set initial state
    gsap.set(cards, {
      opacity: 0,
      y: 80,
      scale: 0.85,
      rotationX: -15,
    });

    // Create scroll-triggered animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: productsGridRef.current,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: {
            amount: 0.8,
            from: 'start',
          },
        });
      },
    });

    // Add hover effects with GSAP
    cards.forEach((card) => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -12,
          scale: 1.03,
          rotationX: 5,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      hoverHandlers.push({ card, handleMouseEnter, handleMouseLeave });
    });

    return () => {
      // Cleanup ScrollTrigger
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      
      // Cleanup event listeners
      hoverHandlers.forEach(({ card, handleMouseEnter, handleMouseLeave }) => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [paginatedProducts]);

  return (
    <ContainerScrollAnimation className="min-h-screen bg-midnight text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ocean/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <Logo className="hidden sm:flex" />
          <p className="sm:hidden text-sm uppercase tracking-[0.35em] text-brand-200">Blue Ocean Products</p>
          <div className="flex items-center gap-2 sm:gap-3 text-sm text-white/70 ml-auto">
            <span className="hidden sm:inline">Shop products & accessories</span>
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
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-xs font-bold text-white">
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

      <main className="pb-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0" ref={heroRef}>
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85"
              data-fallback-index="0"
              alt="Luxury retail store with products on display"
              className="storefront-hero-image h-full w-full object-cover transition-transform duration-300"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              style={{ backgroundColor: '#0b233e', objectPosition: 'center 50%', filter: 'brightness(0.85) contrast(1.1)' }}
              onError={(e) => {
                const sources = [
                  'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=85', // modern retail store
                  'https://images.unsplash.com/photo-1555529908-3a01abb9bb93?auto=format&fit=crop&w=1600&q=85', // boutique shop interior
                  'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=1600&q=85', // shopping boutique
                  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85', // retail storefront
                  '/assets/images/hero-bg.jpg',
                  FALLBACK_GRADIENT,
                ];
                const currentIndex = Number(e.currentTarget.getAttribute('data-fallback-index') || '0');
                const nextIndex = Math.min(currentIndex, sources.length - 1);
                e.currentTarget.setAttribute('data-fallback-index', String(nextIndex + 1));
                e.currentTarget.src = sources[nextIndex];
              }}
            />
            <div className="storefront-background-overlay absolute inset-0 bg-gradient-to-br from-midnight/60 via-ocean/50 to-midnight/70" />
          </div>
          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-32 text-center">
            <div className="storefront-hero-text mb-4" style={{ animationDelay: '0s' }}>
              <Logo className="h-24 w-auto sm:h-32 md:h-40" />
            </div>
            <span className="storefront-hero-text rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-brand-100">
              Blue Ocean Capsule · Resort 2026
            </span>
            <h1 className="storefront-hero-text font-display text-4xl leading-tight sm:text-5xl" style={{ animationDelay: '0.2s' }}>
              Curated coastal luxury for people who live and shop by the tides.
            </h1>
            <p className="storefront-hero-text max-w-2xl text-sm text-white/75 sm:text-base" style={{ animationDelay: '0.4s' }}>
              Discover limited-edition totes, resort slides, and ocean-sourced skincare crafted with our artisan partners.
              Each piece ships with merchandising stories and sensory rituals for your guests.
            </p>
            <div className="storefront-hero-text flex flex-wrap justify-center gap-3" style={{ animationDelay: '0.6s' }}>
              <Button 
                onClick={() => {
                  if (productsSectionRef.current) {
                    productsSectionRef.current.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }
                }}
              >
                Explore Products
              </Button>
            </div>
          </div>
        </section>

        <section ref={productsSectionRef} className="mx-auto mt-20 max-w-7xl px-6">
          <div className="flex flex-col gap-8 text-left">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">Featured Capsule</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-white">Shop the Blue Ocean Resort Assortment</h2>
              </div>
              <p className="text-sm leading-relaxed text-white/65 sm:max-w-md">
                Filter by category to preview your storefront layout and discover our curated product mix.
              </p>
            </div>

            {/* Browse / Filter Bar - Enhanced Design */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-6 backdrop-blur-md shadow-xl">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/10 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-brand-400/10 blur-2xl" />
              
              <div className="relative mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 shadow-lg">
                  <svg className="h-5 w-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Browse Products</h3>
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
                          ? 'border-brand-400/50 bg-gradient-to-br from-brand-500/30 to-brand-600/20 text-white shadow-[0_8px_30px_rgb(29,160,230,0.25)]'
                          : 'border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white',
                      ].join(' ')}
                    >
                      {isActive && (
                        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 blur-lg" />
                      )}
                      <span className="text-base opacity-80">
                        {cat === 'All' ? '🏪' : cat === 'Totes' ? '👜' : cat === 'Handbags' ? '👛' : cat === 'Backpacks' ? '🎒' : cat === 'Slides & Sandals' ? '👡' : cat === 'Beauty Spa Services' ? '💆' : cat === 'Nike & Jordan' ? '👟' : cat === 'Clothing' ? '👕' : '🏷️'}
                      </span>
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
          <div ref={productsGridRef} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr" style={{ perspective: '1000px' }}>
            {productsLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-400 border-t-transparent"></div>
                <p className="text-white/60">Loading products...</p>
              </div>
            ) : productsError ? (
              <div className="col-span-full rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                <p className="text-red-200 font-semibold">Error loading products</p>
                <p className="mt-2 text-sm text-red-200/70">{productsError}</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-white/60">No products found in this category.</p>
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
                  />
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!productsLoading && !productsError && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={[
                  'group flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold transition-all duration-300',
                  currentPage === 1
                    ? 'cursor-not-allowed border-white/5 bg-white/5 text-white/30'
                    : 'border-white/10 bg-white/5 text-white/75 hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-white',
                ].join(' ')}
              >
                <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>

              {/* Page Indicator */}
              <div className="relative overflow-hidden rounded-2xl border border-brand-400/30 bg-gradient-to-br from-brand-500/20 to-brand-600/10 px-6 py-3 backdrop-blur">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-400/10 to-brand-600/10" />
                <div className="relative flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Page</span>
                  <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-white/20 px-2 text-sm font-bold text-white">
                    {currentPage}
                  </span>
                  <span className="text-sm text-white/60">of</span>
                  <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-white/10 px-2 text-sm font-bold text-white/80">
                    {totalPages}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="hidden sm:flex flex-col gap-1.5">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                  />
                </div>
                <p className="text-center text-xs text-white/50">
                  {paginatedProducts.length} of {filteredProducts.length} products
                </p>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={[
                  'group flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold transition-all duration-300',
                  currentPage === totalPages
                    ? 'cursor-not-allowed border-white/5 bg-white/5 text-white/30'
                    : 'border-white/10 bg-white/5 text-white/75 hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-white',
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

        {/* Ready to Curate Drop CTA */}
        <section className="mx-auto mt-20 max-w-5xl rounded-[36px] border border-white/10 bg-gradient-to-br from-brand-500/20 to-brand-600/10 px-8 py-12 text-center backdrop-blur-sm">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">Exclusive Partnership</p>
            <h3 className="font-display text-3xl text-white">Ready to curate your own drop?</h3>
          </div>
          <p className="mt-4 text-base text-white/80">
            Partner with our merchandising team to style an exclusive capsule, complete with storytelling assets, training,
            and launch strategy tailored to your retail needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button onClick={handleContactBlueOcean}>Contact Blue Ocean</Button>
            <Button variant="secondary" onClick={handleCallOwner} icon={Phone}>
              Call Owner: +263 71 046 5531
            </Button>
            <Button variant="secondary" onClick={handleDownloadLineSheet}>Download Line Sheet</Button>
          </div>
        </section>

        {/* About & Newsletter + Preferences */}
        <section className="mx-auto mt-16 max-w-7xl px-6 pb-12">
          <div className="grid gap-10 rounded-[28px] border border-white/10 bg-white/[0.06] p-8 backdrop-blur">
            {/* Top: About + Newsletter */}
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl text-white">About Us</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
                  We curate coastal-luxury products and spa services for resort retailers and boutique partners.
                  Our commitment to quality merchandising and guest experience guides everything we do.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 hover:text-white transition"
                    aria-label="Facebook"
                  >
                    f
                  </button>
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 hover:text-white transition"
                    aria-label="Instagram"
                  >
                    ◦
                  </button>
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 hover:text-white transition"
                    aria-label="X"
                  >
                    x
                  </button>
                </div>
              </div>
              <form
                className="flex flex-col gap-4 lg:max-w-lg"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <h3 className="font-display text-2xl text-white">Newsletter</h3>
                <p className="text-sm text-white/70">
                  Sign up for exclusive offers, product launches, events and more.
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none backdrop-blur focus:border-brand-400/40 transition"
                  />
                  <Button type="submit" className="whitespace-nowrap">Subscribe</Button>
                </div>
              </form>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Bottom: Currency / Language selectors + Payments */}
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
                  {['USD $', 'ZWG $'].map((c) => {
                    const active = currency === c;
                    const flag = c.startsWith('USD') ? '🇺🇸' : '🇿🇼';
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCurrency(c)}
                        className={[
                          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition',
                          active ? 'bg-brand-500/25 text-white shadow-glow' : 'text-white/80 hover:bg-white/10',
                        ].join(' ')}
                      >
                        <span className="text-base">{flag}</span>
                        <span>{c}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
                  {['English', 'French'].map((lng) => {
                    const active = language === lng;
                    return (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => setLanguage(lng)}
                        className={[
                          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition',
                          active ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10',
                        ].join(' ')}
                      >
                        <span>🌐</span>
                        <span>{lng}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="no-scrollbar -mx-2 flex w-full flex-wrap items-center gap-3 overflow-x-auto px-2 lg:flex-nowrap lg:w-auto">
                <style>{`
                  @keyframes slideIn {
                    from {
                      opacity: 0;
                      transform: translateX(-20px);
                    }
                    to {
                      opacity: 1;
                      transform: translateX(0);
                    }
                  }
                  .payment-chip {
                    animation: slideIn 0.5s ease-out backwards;
                  }
                  .payment-chip:hover {
                    animation: pulse 2s infinite;
                  }
                  @keyframes pulse {
                    0%, 100% {
                      box-shadow: 0 0 0 0 rgba(29, 160, 230, 0.7);
                    }
                    50% {
                      box-shadow: 0 0 0 10px rgba(29, 160, 230, 0);
                    }
                  }
                `}</style>
                {paymentChips.map((p, idx) => (
                  <span
                    key={p.name}
                    className={`payment-chip inline-flex items-center justify-center rounded-2xl border border-white/10 ${p.bgColor} px-4 py-2.5 backdrop-blur transition-all duration-300 hover:border-brand-400/40 hover:shadow-lg hover:scale-105`}
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
            </div>
          </div>
        </section>
      </main>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        open={isModalOpen}
        onClose={handleCloseModal}
        onViewProduct={handleViewRelatedProduct}
        onAddToCart={addToCart}
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
