import { useMemo, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useServices } from '../hooks/useServices.js';
import { ServiceCard } from '../components/ServiceCard.jsx';
import { ServiceDetailsModal } from '../components/ServiceDetailsModal.jsx';
import { BookingDrawer } from '../components/BookingDrawer.jsx';
import { CartNotification } from '../components/CartNotification.jsx';
import { Button } from '../components/Button.jsx';
import { BeautySpaLogo } from '../components/BeautySpaLogo.jsx';
import { ContainerScrollAnimation } from '../components/ui/ScrollTriggerAnimations.jsx';
import { motion } from 'framer-motion';
import api from '../services/api.js';
import { HeroDesignali } from '../components/ui/HeroDesignali.jsx';

gsap.registerPlugin(ScrollTrigger);

export function BeautySpaStorefront({ onClose }) {
  // Fetch services from backend
  const { services: allServices, loading: servicesLoading, error: servicesError } = useServices();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);
  const [bookingIntent, setBookingIntent] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false });
  const [isConfirming, setIsConfirming] = useState(false);

  const serviceCategories = useMemo(() => {
    const uniqueCategories = new Set((allServices || []).map((service) => service.serviceCategory));
    return ['All', ...uniqueCategories];
  }, [allServices]);

  const filteredServices = useMemo(() => {
    if (!allServices || allServices.length === 0) return [];
    if (activeCategory === 'All') {
      return allServices;
    }
    return allServices.filter((service) => service.serviceCategory === activeCategory);
  }, [activeCategory, allServices]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleShowService = (service, intent = 'view') => {
    setSelectedService(service);
    setBookingIntent(intent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setBookingIntent('view');
  };

  const showNotification = (message) => {
    setNotification({ message, isVisible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 3200);
  };

  const handleBookService = (service, bookingData) => {
    if (!service) return;

    const bookingId = `${service.id}-${Date.now()}`;
    const dateLabel = service.bookableDates?.find((date) => date.value === bookingData.date)?.label;
    const selectedAddOns = bookingData.addOns
      ?.map((addOnId) => service.addOns?.find((addOn) => addOn.id === addOnId))
      .filter(Boolean);

    const bookingEntry = {
      bookingId,
      serviceId: service.id,
      name: service.name,
      serviceCategory: service.serviceCategory,
      duration: service.duration,
      basePrice: service.basePrice,
      currency: service.currency,
      therapistLevel: service.therapistLevel,
      image: service.image,
      date: bookingData.date,
      dateLabel: dateLabel || bookingData.date,
      time: bookingData.time,
      addOns: selectedAddOns,
      addOnTotal: bookingData.addOnTotal || 0,
      totalPrice: bookingData.totalPrice || service.basePrice,
      notes: bookingData.notes,
    };

    setBookings((prev) => [...prev, bookingEntry]);
    showNotification(`Reserved: ${service.name} · ${bookingEntry.dateLabel} at ${bookingEntry.time}`);
    setIsBookingOpen(true);
    handleCloseModal();
  };

  const handleCancelBooking = (bookingId) => {
    setBookings((prev) => prev.filter((booking) => booking.bookingId !== bookingId));
  };

  const handleClearBookings = () => {
    setBookings([]);
  };

  const handleConfirmBookings = async () => {
    if (bookings.length === 0) return;

    setIsConfirming(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        showNotification('Please sign in to confirm your bookings. Your bookings have been saved locally.');
        setIsConfirming(false);
        return;
      }

      // Transform bookings to match backend format
      const bookingsToSubmit = bookings.map(booking => ({
        serviceId: booking.serviceId,
        name: booking.name,
        serviceCategory: booking.serviceCategory,
        duration: booking.duration,
        basePrice: booking.basePrice,
        totalPrice: booking.totalPrice,
        currency: booking.currency || 'USD',
        date: booking.date,
        time: booking.time,
        therapistLevel: booking.therapistLevel,
        addOns: booking.addOns || [],
        addOnTotal: booking.addOnTotal || 0,
        notes: booking.notes || '',
        image: booking.image,
      }));

      // Call API to create bookings
      const response = await api.bookings.create(bookingsToSubmit);

      if (response.success) {
        showNotification(`Successfully confirmed ${bookings.length} booking(s)! Our spa concierge will contact you shortly.`);
        setBookings([]); // Clear bookings after successful confirmation
        setIsBookingOpen(false);
      } else {
        showNotification(response.message || 'Failed to confirm bookings. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming bookings:', error);
      const errorMessage = error.message || 'Failed to confirm bookings. Please try again.';
      showNotification(errorMessage);
    } finally {
      setIsConfirming(false);
    }
  };

  // Parallax effect for hero section
  const heroRef = useRef(null);
  const servicesGridRef = useRef(null);
  
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

  // GSAP animations for services grid
  useEffect(() => {
    if (!servicesGridRef.current) return;

    const cards = servicesGridRef.current.querySelectorAll('.storefront-card');
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
      trigger: servicesGridRef.current,
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
  }, [filteredServices]);

  return (
    <ContainerScrollAnimation className="min-h-screen bg-midnight text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ocean/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <BeautySpaLogo className="scale-50 sm:scale-75" size={120} showText={false} />
            </div>
            <div className="sm:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-br from-purple-600 to-purple-400">
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
          <div className="ml-auto flex items-center gap-2 text-sm text-white/70 sm:gap-3">
            <span className="hidden sm:inline">Luxury spa services & wellness itineraries</span>
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="relative rounded-full border border-white/20 bg-white/10 px-4 py-2 transition backdrop-blur-sm hover:bg-white/20"
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V5a4 4 0 118 0v2m-9 4h10l1 9H6l1-9zm2 0V7m4 0v4"
                />
              </svg>
              {bookings.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-xs font-bold text-white">
                  {bookings.length > 9 ? '9+' : bookings.length}
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
        <HeroDesignali
          title="Rejuvenate your senses with ocean-inspired luxury"
          subtitle="Tana's Beauty Boost Spa · Wellness 2026"
          description="Experience our signature spa services featuring marine botanicals, heated ocean stones, and reef-safe rituals designed for complete relaxation and renewal."
          typeWriterStrings={['Facial Treatments', 'Body Massages', 'Wellness Rituals', 'Spa Packages', 'Luxury Services']}
          primaryButtonText="Book Treatment"
          primaryButtonAction={() => {
            if (allServices && allServices.length > 0) {
              handleShowService(allServices[0], 'book');
            }
          }}
          secondaryButtonText="View Itinerary"
          secondaryButtonAction={() => setIsBookingOpen(true)}
          showBadge={true}
          badgeText="Tana's Beauty Boost Spa · Wellness 2026"
          accentColor="purple-500"
          canvasId="spa-hero-canvas"
        />

        <section className="mx-auto mt-20 max-w-7xl px-6">
          <div className="flex flex-col gap-8 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">Spa Services</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-white">Our Treatment Menu</h2>
              </div>
              <p className="text-sm leading-relaxed text-white/65 sm:max-w-md">
                Browse curated ocean-inspired rituals designed to balance mind, body, and spirit.
              </p>
            </div>

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
                {serviceCategories.map((category) => {
                  const isActive = activeCategory === category;
                  const categoryCount =
                    category === 'All'
                      ? (allServices || []).length
                      : (allServices || []).filter((service) => service.serviceCategory === category).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
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
                        {category === 'All'
                          ? '✨'
                          : category === 'Facials'
                            ? '💆'
                            : category === 'Massages'
                              ? '🧘'
                              : category === 'Body Treatments'
                                ? '🌊'
                                : category === 'Makeup'
                                  ? '💄'
                                  : category === 'Beauty Tech & Electronics'
                                    ? '🔆'
                                    : '💅'}
                      </span>
                      <span className="whitespace-nowrap">{category}</span>
                      <span
                        className={[
                          'inline-flex min-w-[2rem] items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-white/10 text-white/60 group-hover:bg-white/15 group-hover:text-white/80',
                        ].join(' ')}
                      >
                        {categoryCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div ref={servicesGridRef} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ perspective: '1000px' }}>
            {servicesLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-400 border-t-transparent"></div>
                <p className="text-white/60">Loading spa services...</p>
              </div>
            ) : servicesError ? (
              <div className="col-span-full rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                <p className="text-red-200 font-semibold">Error loading services</p>
                <p className="mt-2 text-sm text-red-200/70">{servicesError}</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-white/60">No services found in this category.</p>
              </div>
            ) : (
              filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
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
                  <ServiceCard
                    service={service}
                    onViewDetails={(selected) => handleShowService(selected, 'view')}
                    onBook={(selected) => handleShowService(selected, 'book')}
                  />
                </motion.div>
              ))
            )}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-5xl rounded-[36px] border border-white/10 bg-gradient-to-br from-brand-500/20 to-brand-600/10 px-8 py-12 text-center backdrop-blur-sm">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">Wellness Packages</p>
            <h3 className="font-display text-3xl text-white">Ready to book your spa experience?</h3>
          </div>
          <p className="mt-4 text-base text-white/80">
            Contact our spa concierge to customize a treatment package tailored to your wellness needs.
          </p>
          <div className="mt-6 mb-4 flex flex-wrap justify-center gap-3 text-sm text-white/70">
            <a href="tel:+27788637252" className="flex items-center gap-2 hover:text-brand-200 transition-colors">
              <span>📞</span>
              <span>+27 788637252</span>
            </a>
            <span className="text-white/30">•</span>
            <a href="mailto:Tanasbeautyboost@gmail.com" className="flex items-center gap-2 hover:text-brand-200 transition-colors">
              <span>📧</span>
              <span>Tana'sbeautyboost@gmail.com</span>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button onClick={() => {
              const email = 'Tanasbeautyboost@gmail.com';
              const subject = encodeURIComponent('Spa Booking Inquiry');
              const body = encodeURIComponent('Hello, I would like to inquire about booking a spa treatment package.');
              window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
            }}>
              Contact Spa Concierge
            </Button>
            <Button variant="secondary" onClick={() => setIsBookingOpen(true)}>
              View Packages
            </Button>
          </div>
        </section>
      </main>

      <ServiceDetailsModal
        service={selectedService}
        open={isModalOpen}
        intent={bookingIntent}
        onClose={handleCloseModal}
        onBook={handleBookService}
      />

      <BookingDrawer
        bookings={bookings}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onCancelBooking={handleCancelBooking}
        onClearBookings={handleClearBookings}
        onConfirmBookings={handleConfirmBookings}
        isConfirming={isConfirming}
      />

      <CartNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ message: '', isVisible: false })}
      />
    </ContainerScrollAnimation>
  );
}

