import { useMemo, useState } from 'react';
import { highlightProducts } from '../data/products.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductDetailsModal } from '../components/ProductDetailsModal.jsx';
import { Cart } from '../components/Cart.jsx';
import { CartNotification } from '../components/CartNotification.jsx';
import { Button } from '../components/Button.jsx';
import { BeautySpaLogo } from '../components/BeautySpaLogo.jsx';

const FALLBACK_GRADIENT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGIyMzNlO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZGEwZTY7c3RvcC1vcGFjaXR5OjAuNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzA0MGIxODtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

export function BeautySpaStorefront({ onClose }) {
  // Filter only Beauty Spa Services
  const spaProducts = useMemo(
    () => highlightProducts.filter((p) => p.category === 'Beauty Spa Services'),
    []
  );

  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Spa service categories
  const spaCategories = useMemo(() => {
    const categories = ['All', 'Facials', 'Massages', 'Body Treatments', 'Nail Services'];
    return categories;
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return spaProducts;
    
    // Map categories to product badges/descriptions
    return spaProducts.filter((p) => {
      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      
      if (activeCategory === 'Facials') {
        return name.includes('facial') || desc.includes('facial');
      }
      if (activeCategory === 'Massages') {
        return name.includes('massage') || name.includes('therapy') || desc.includes('massage');
      }
      if (activeCategory === 'Body Treatments') {
        return name.includes('body') || name.includes('scrub') || name.includes('wrap') || desc.includes('body');
      }
      if (activeCategory === 'Nail Services') {
        return name.includes('manicure') || name.includes('nail') || desc.includes('nail');
      }
      return true;
    });
  }, [activeCategory, spaProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  // Product details modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    setSelectedProduct(relatedProduct);
  };

  // Cart functions
  const addToCart = (product, color = '', size = '') => {
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
    showNotification('Cart cleared');
  };

  const showNotification = (message) => {
    setNotification({ message, isVisible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-midnight text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ocean/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <BeautySpaLogo className="scale-50 sm:scale-75" size={120} showText={false} />
            </div>
            <div className="sm:hidden">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 border-2 border-amber-400 flex items-center justify-center">
                <span className="text-2xl">💆</span>
              </div>
            </div>
            <div className="hidden md:block">
              <p
                className="text-sm font-serif font-semibold"
                style={{
                  background: 'linear-gradient(180deg, #FCD34D 0%, #D97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Tana's Beauty Boost Spa
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-sm text-white/70 ml-auto">
            <span className="hidden sm:inline">Luxury spa services & treatments</span>
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
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=85"
              alt="Luxury spa treatment"
              className="h-full w-full object-cover"
              style={{ backgroundColor: '#0b233e', objectPosition: 'center 40%', filter: 'brightness(0.9) contrast(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-midnight/70 via-ocean/60 to-midnight/75" />
          </div>
          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-32 text-center">
            {/* Logo Section */}
            <div className="mb-4">
              <BeautySpaLogo className="scale-90 sm:scale-100" />
            </div>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-brand-100">
              Tana's Beauty Boost Spa · Wellness 2026
            </span>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              Rejuvenate your senses with ocean-inspired luxury treatments.
            </h1>
            <p className="max-w-2xl text-sm text-white/75 sm:text-base">
              Experience our signature spa services featuring marine botanicals, heated ocean stones, and
              reef-safe treatments designed for complete relaxation and renewal.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button>Book Treatment</Button>
              <Button variant="secondary">View Packages</Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mx-auto mt-20 max-w-7xl px-6">
          <div className="flex flex-col gap-8 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">Spa Services</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-white">Our Treatment Menu</h2>
              </div>
              <p className="text-sm leading-relaxed text-white/65 sm:max-w-md">
                Browse our curated selection of luxury spa treatments and wellness services.
              </p>
            </div>

            {/* Category Filter */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-6 backdrop-blur-md shadow-xl">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/10 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-brand-400/10 blur-2xl" />
              
              <div className="relative mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 shadow-lg">
                  <svg className="h-5 w-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Filter Services</h3>
                  <p className="text-xs text-white/50">Select a category</p>
                </div>
              </div>
              
              <div className="no-scrollbar relative -mx-2 flex gap-3 overflow-x-auto px-2 pb-1">
                {spaCategories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count = cat === 'All' ? spaProducts.length : filteredProducts.length;
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
                        {cat === 'All' ? '✨' : cat === 'Facials' ? '💆' : cat === 'Massages' ? '🧘' : cat === 'Body Treatments' ? '🌊' : '💅'}
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
                        {cat === 'All' ? spaProducts.length : count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewProductDetails}
                onAddToCart={(product) => addToCart(product)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
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

        {/* CTA Section */}
        <section className="mx-auto mt-20 max-w-5xl rounded-[36px] border border-white/10 bg-gradient-to-br from-brand-500/20 to-brand-600/10 px-8 py-12 text-center backdrop-blur-sm">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">Wellness Packages</p>
            <h3 className="font-display text-3xl text-white">Ready to book your spa experience?</h3>
          </div>
          <p className="mt-4 text-base text-white/80">
            Contact our spa concierge to customize a treatment package tailored to your wellness needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button>Contact Spa Concierge</Button>
            <Button variant="secondary">View Packages</Button>
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
      />

      {/* Cart Notification */}
      <CartNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ message: '', isVisible: false })}
      />
    </div>
  );
}

