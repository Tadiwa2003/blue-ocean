import { useMemo, useState } from 'react';
import { spaServices } from '../data/spaServices.js';
import { ServiceCard } from '../components/ServiceCard.jsx';
import { ServiceDetailsModal } from '../components/ServiceDetailsModal.jsx';
import { BookingDrawer } from '../components/BookingDrawer.jsx';
import { CartNotification } from '../components/CartNotification.jsx';
import { Button } from '../components/Button.jsx';
import { BeautySpaLogo } from '../components/BeautySpaLogo.jsx';

export function BeautySpaStorefront({ onClose }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);
  const [bookingIntent, setBookingIntent] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false });

  const serviceCategories = useMemo(() => {
    const uniqueCategories = new Set(spaServices.map((service) => service.serviceCategory));
    return ['All', ...uniqueCategories];
  }, []);

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All') {
      return spaServices;
    }
    return spaServices.filter((service) => service.serviceCategory === activeCategory);
  }, [activeCategory]);

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

  const handleConfirmBookings = () => {
    if (bookings.length === 0) return;
    showNotification('Thank you! Our spa concierge will confirm your itinerary shortly.');
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen bg-midnight text-white">
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
              Experience our signature spa services featuring marine botanicals, heated ocean stones, and reef-safe rituals designed for complete relaxation and renewal.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => handleShowService(spaServices[0], 'book')}>Book Treatment</Button>
              <Button variant="secondary" onClick={() => setIsBookingOpen(true)}>
                View Itinerary
              </Button>
            </div>
          </div>
        </section>

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
                      ? spaServices.length
                      : spaServices.filter((service) => service.serviceCategory === category).length;

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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onViewDetails={(selected) => handleShowService(selected, 'view')}
                onBook={(selected) => handleShowService(selected, 'book')}
              />
            ))}
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
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button onClick={() => showNotification('Concierge will reach out shortly with package details.')}>Contact Spa Concierge</Button>
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
      />

      <CartNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ message: '', isVisible: false })}
      />
    </div>
  );
}

