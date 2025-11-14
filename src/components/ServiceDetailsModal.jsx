import { useEffect, useMemo, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button.jsx';
import {
  buildYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
} from '../utils/youtube.js';
import { ChevronLeft, ChevronRight, Star, Check, Clock, Sparkles, Calendar, AlertCircle, X } from 'lucide-react';
import { logger } from '../utils/logger.js';
import { convertDateLabelToISO, isPastDateTime, getRelativeDateLabel } from '../utils/dateHelpers.js';

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
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="rgba(255,255,255,0.85)">
        Spa Ritual
      </text>
    </svg>
  `);

const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export function ServiceDetailsModal({ service, open, onClose, onBook, intent = 'view' }) {
  const [selectedImage, setSelectedImage] = useState(service?.image || fallbackImage);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState(() => new Set());
  const [guestNote, setGuestNote] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [videoError, setVideoError] = useState(false);
  const [videoEmbedUrl, setVideoEmbedUrl] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const containerRef = useRef(null);

  const imageGallery = useMemo(() => {
    if (!service) return [fallbackImage];
    const gallery = service.gallery?.length ? service.gallery : [];
    const baseImage = service.image ? [service.image] : [];
    const combined = [...baseImage, ...gallery];
    const unique = combined.filter(Boolean).filter((img, index, arr) => arr.indexOf(img) === index);
    return unique.length ? unique : [fallbackImage];
  }, [service]);

  useEffect(() => {
    if (service && open) {
      setSelectedImage(imageGallery[0] || fallbackImage);
      setCurrentImageIndex(0);
      setImageError(false);
      // Initialize date and time with first available options
      let initialDate = service.bookableDates?.[0]?.value || '';
      let initialTime = service.timeSlots?.[0] || '';
      
      // Convert date label to ISO format
      if (initialDate) {
        const isoDate = convertDateLabelToISO(initialDate);
        if (isoDate) {
          initialDate = isoDate;
        }
      }
      
      // Always default to tomorrow to avoid past dates
      // Check if the initial date/time would be in the past
      if (!initialDate || (initialDate && initialTime && isPastDateTime(initialDate, initialTime))) {
        // Use tomorrow as default
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        initialDate = tomorrow.toISOString().split('T')[0];
        
        // If we had a time but it's in the past, keep the time (it will be valid for tomorrow)
        // If no time, use first available or default
        if (!initialTime) {
          initialTime = service.timeSlots?.[0] || '10:00 AM';
        }
      } else {
        // Even if date seems valid, double-check it's not today with a past time
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(initialDate + 'T00:00:00');
        checkDate.setHours(0, 0, 0, 0);
        
        // If it's today, check if the time is in the past
        if (checkDate.getTime() === today.getTime() && initialTime && isPastDateTime(initialDate, initialTime)) {
          // Use tomorrow instead
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          initialDate = tomorrow.toISOString().split('T')[0];
        }
      }
      
      // Final validation: ensure we have a valid date
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(initialDate)) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        initialDate = tomorrow.toISOString().split('T')[0];
      }
      
      // Ensure we have a valid time
      if (!initialTime) {
        initialTime = service.timeSlots?.[0] || '10:00 AM';
      }
      
      setSelectedDate(initialDate);
      setSelectedTime(initialTime);
      setSelectedAddOns(new Set());
      setGuestNote('');
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      setVideoError(false);
      setActiveTab('overview');
      setShowRequirementsModal(false);
      setBookingError('');
      
      logger.debug('ServiceDetailsModal initialized', {
        serviceName: service.name,
        hasBookableDates: !!service.bookableDates?.length,
        bookableDates: service.bookableDates,
        hasTimeSlots: !!service.timeSlots?.length,
        timeSlots: service.timeSlots,
        initialDate,
        initialTime,
      });

      if (service.videoUrl) {
        const origin =
          typeof window !== 'undefined' && window.location?.origin ? window.location.origin : undefined;
        const embedUrl = buildYouTubeEmbedUrl(service.videoUrl, origin);
        setVideoEmbedUrl(embedUrl);
        const videoId = getYouTubeVideoId(service.videoUrl);
        setVideoThumbnail(getYouTubeThumbnailUrl(videoId));
      } else {
        setVideoEmbedUrl(null);
        setVideoThumbnail(null);
      }
    }
  }, [service, open, imageGallery]);

  // Handle Escape key for requirements modal
  useEffect(() => {
    if (!showRequirementsModal) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        event.stopImmediatePropagation(); // Prevent other Escape handlers from running
        setShowRequirementsModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape, true); // Use capture phase
    return () => {
      document.removeEventListener('keydown', handleEscape, true);
    };
  }, [showRequirementsModal]);

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
    const nextIndex = currentImageIndex === imageGallery.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(imageGallery[nextIndex] || fallbackImage);
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? imageGallery.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(imageGallery[prevIndex] || fallbackImage);
  };

  const renderStars = (rating = 4.9) => {
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

  const addOnList = service?.addOns || [];
  const quickFacts = useMemo(() => {
    if (!service) return [];
    return [
      service.duration
        ? {
            icon: '⏱️',
            label: 'Duration',
            value: `${service.duration} min`,
          }
        : null,
      service.therapistLevel
        ? {
            icon: '💠',
            label: 'Therapist',
            value: service.therapistLevel,
          }
        : null,
      service.serviceCategory
        ? {
            icon: '🌊',
            label: 'Category',
            value: service.serviceCategory,
          }
        : null,
    ].filter(Boolean);
  }, [service]);
  const hasAddOns = addOnList.length > 0;
  const hasHighlights = Boolean(service?.experienceHighlights?.length);
  const hasIncludes = Boolean(service?.includes?.length);
  const hasBenefits = Boolean(service?.benefits?.length);
  const hasVideo = Boolean(videoEmbedUrl);
  const hasNarrative = Boolean(service?.sessionNarrative);

  const renderDetailSection = (title, items, icon = '•', emptyMessage) => {
    if (!items || items.length === 0) {
      if (!emptyMessage) return null;
      return (
        <section className="rounded-[28px] border border-white/8 bg-white/3 p-5 text-sm text-white/70 shadow-[0_12px_36px_rgba(7,45,72,0.18)] backdrop-blur">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">{title}</h3>
          <p className="mt-3 text-xs text-white/50">{emptyMessage}</p>
        </section>
      );
    }

    return (
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(7,45,72,0.25)] backdrop-blur">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">{title}</h3>
        <ul className="mt-4 space-y-3 text-sm text-white/75">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex items-start gap-3">
              <span className="text-brand-300">{icon}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const renderVideoEmbed = (wrapperClass, aspectClass) => {
    if (!videoEmbedUrl) return null;

    return (
      <div className={wrapperClass}>
        <div className={`${aspectClass} relative`}>
          {!videoError ? (
            <iframe
              key={videoEmbedUrl}
              src={videoEmbedUrl}
              title={`${service.name} treatment illustration`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full rounded-3xl lg:rounded-none"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center text-white/80">
              {videoThumbnail && (
                <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={videoThumbnail}
                    alt={`${service.name} video thumbnail`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white">
                      ▶
                    </span>
                  </div>
                </div>
              )}
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
                Video unavailable
              </span>
              <p className="text-xs leading-relaxed text-white/70">
                This illustration can&apos;t load inside the modal. You can view it directly on YouTube.
              </p>
              <a
                href={service.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  const addOnTotal = useMemo(() => {
    return Array.from(selectedAddOns).reduce((sum, addOnId) => {
      const addOn = addOnList.find((item) => item.id === addOnId);
      return addOn ? sum + addOn.price : sum;
    }, 0);
  }, [selectedAddOns, addOnList]);

  const totalPrice = service ? service.basePrice + addOnTotal : 0;

  const handleAddOnToggle = (addOnId) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(addOnId)) {
        next.delete(addOnId);
      } else {
        next.add(addOnId);
      }
      return next;
    });
  };

  // Validation helper function
  const validateBooking = (service, selectedDate, selectedTime, guestEmailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!service) {
      return {
        valid: false,
        error: 'Service information is missing. Please try again.',
      };
    }

    if (!selectedDate || !selectedTime) {
      return {
        valid: false,
        error: 'Please select both a date and time for your booking.',
      };
    }
    
    // Convert date to ISO format for validation
    let isoDate = selectedDate;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(isoDate)) {
      isoDate = convertDateLabelToISO(isoDate);
      if (!isoDate) {
        return {
          valid: false,
          error: 'Invalid date format. Please select a valid date.',
        };
      }
    }
    
    // Validate that date/time is not in the past
    if (isPastDateTime(isoDate, selectedTime)) {
      return {
        valid: false,
        error: 'Cannot book a date and time in the past. Please select a future date and time.',
      };
    }

    if (!guestEmailValue || !emailRegex.test(guestEmailValue.trim())) {
      return {
        valid: false,
        error: 'Please provide a valid email address for booking confirmations.',
      };
    }

    return { valid: true, error: null };
  };

  const handleBook = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setBookingError('');

    // Validate booking
    const validation = validateBooking(service, selectedDate, selectedTime, guestEmail);
    if (!validation.valid) {
      setBookingError(validation.error);
      return;
    }

    // Convert date to ISO format
    let isoDate = selectedDate;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(isoDate)) {
      isoDate = convertDateLabelToISO(isoDate);
      if (!isoDate) {
        setBookingError('Invalid date format. Please select a valid date.');
        return;
      }
    }
    
    // Prepare booking data
    const bookingData = {
      date: isoDate,
      time: selectedTime,
      addOns: Array.from(selectedAddOns),
      notes: guestNote.trim(),
      addOnTotal,
      totalPrice,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
    };

    logger.debug('Booking data prepared:', bookingData);

    // Call the onBook handler with booking data
    if (typeof onBook === 'function') {
      try {
        onBook(service, bookingData);
        logger.debug('onBook handler called successfully');
      } catch (error) {
        logger.error('Error calling onBook handler:', error);
        setBookingError('An error occurred while processing your booking. Please try again.');
      }
    } else {
      logger.error('onBook handler is not provided or is not a function', {
        onBook,
        type: typeof onBook,
      });
      setBookingError('Booking functionality is not available. Please refresh the page and try again.');
    }
  };

  if (!open || !service) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-midnight/95 backdrop-blur-md overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
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
        /* Smooth scrolling for modal content */
        .service-modal-container {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .service-modal-container::-webkit-scrollbar {
          width: 8px;
        }
        .service-modal-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .service-modal-container::-webkit-scrollbar-thumb {
          background: rgba(29, 160, 230, 0.3);
          border-radius: 4px;
        }
        .service-modal-container::-webkit-scrollbar-thumb:hover {
          background: rgba(29, 160, 230, 0.5);
        }
      `}</style>

      <div className="absolute inset-0 modal-backdrop" onClick={onClose} />

      <div ref={containerRef} className="service-modal-container relative w-full max-w-7xl my-6 mx-4 rounded-[40px] border border-white/10 bg-gradient-to-br from-ocean/95 to-midnight/98 shadow-2xl modal-content">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-20 rounded-full border border-white/20 bg-white/10 p-3 text-white/80 transition hover:bg-white/20 hover:text-white backdrop-blur-sm"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr] min-h-0">
          <article className="relative bg-gradient-to-br from-ocean/60 to-midnight/90 p-6 sm:p-8 lg:p-10">
            <div className="space-y-8 lg:sticky lg:top-6">
              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_35px_90px_rgba(7,45,72,0.45)] group">
                <div className="aspect-[4/5] lg:aspect-[3/4]">
                  <img
                    src={selectedImage}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => {
                      if (!imageError) {
                        setImageError(true);
                        setSelectedImage(fallbackImage);
                      }
                    }}
                  />
                </div>
                
                {/* Navigation Arrows */}
                {imageGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/85 via-transparent to-transparent" />
                {service.tags && service.tags.length > 0 && (
                  <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {(service.headline || service.description) && (
                  <div className="absolute inset-x-6 bottom-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">Signature Ritual</p>
                    <p className="mt-2 text-base leading-relaxed text-white/85">
                      {service.headline || service.description}
                    </p>
                  </div>
                )}
              </div>

              {imageGallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {imageGallery.map((img, idx) => {
                    const isActive = currentImageIndex === idx;
                    return (
                      <button
                        key={`${service?.id || 'service'}-thumb-${idx}`}
                        type="button"
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setSelectedImage(img || fallbackImage);
                        }}
                        className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${
                          isActive
                            ? 'border-brand-400 shadow-lg shadow-brand-400/30 ring-2 ring-brand-400/50'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        aria-label={`View gallery image ${idx + 1}`}
                      >
                        <img
                          src={img || fallbackImage}
                          alt={`Thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                        {isActive && (
                          <div className="absolute inset-0 border-2 border-brand-400 rounded-xl" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {hasVideo && (
                <div className="rounded-[32px] border border-white/10 bg-black/60 p-5 shadow-[0_28px_70px_rgba(7,45,72,0.4)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                    Treatment Illustration
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-white">Step inside the ritual</h3>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80">
                      ▶
                    </span>
                  </div>
                  {renderVideoEmbed('mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black', 'aspect-video')}
                  <p className="mt-3 text-xs text-white/55">
                    Glimpse the flow, touchpoints, and atmosphere your guest will experience.
                  </p>
                </div>
              )}

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(7,45,72,0.32)] backdrop-blur">
                <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
                  How this session unfolds
                </h3>
                {service.sessionNarrative ? (
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{service.sessionNarrative}</p>
                ) : (
                  <p className="mt-3 text-xs text-white/50 italic">
                    Session narrative details will be available soon.
                  </p>
                )}
              </div>
            </div>
          </article>

          <div className="flex flex-col gap-8 bg-gradient-to-bl from-midnight/95 to-ocean/60 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-3rem)] lg:max-h-none">
            <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(7,45,72,0.35)] backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-300">
                    {service.serviceCategory}
                  </p>
                  <h1 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">{service.name}</h1>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {renderStars(4.9)}
                    </div>
                    <span className="text-sm text-white/60">
                      4.9 (89 reviews)
                    </span>
                  </div>
                  {service.headline && (
                    <p className="text-base font-semibold text-brand-100/90">{service.headline}</p>
                  )}
                  <p className="text-sm leading-relaxed text-white/70">{service.description}</p>
                </div>
                <div className="shrink-0 rounded-3xl border border-brand-400/30 bg-gradient-to-br from-brand-500/20 to-brand-600/10 px-5 py-4 text-right shadow-[0_18px_45px_rgba(29,160,230,0.25)]">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/65">Investment</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {formatCurrency(service.basePrice, service.currency)}
                  </p>
                  <p className="text-xs text-white/55">per guest</p>
                  </div>
              </div>

              {quickFacts.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {quickFacts.map((fact) => (
                    <span
                      key={fact.label}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70"
                    >
                      <span>{fact.icon}</span>
                      <span className="text-white/80">{fact.value}</span>
                    </span>
                    ))}
                </div>
              )}
            </section>

            <div className="grid gap-5">
              {renderDetailSection(
                'What to Expect',
                service?.experienceHighlights,
                '✦',
                'Session highlights will be curated soon.'
              )}
              {renderDetailSection(
                'Your Ritual Includes',
                service?.includes,
                '✓',
                'Inclusions will be confirmed for this ritual.'
              )}
              {service?.benefits && service.benefits.length > 0 ? (
                <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(7,45,72,0.25)] backdrop-blur">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">Wellness Benefits</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {service.benefits.map((benefit, index) => (
                      <div
                        key={`benefit-${index}`}
                        className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/75 shadow-[0_14px_30px_rgba(7,45,72,0.18)]"
                      >
                        {benefit}
                      </div>
                    ))}
                </div>
                </section>
              ) : (
                renderDetailSection(
                  'Wellness Benefits',
                  [],
                  '•',
                  'Benefits will be published once the treatment is finalized.'
                )
              )}
                    </div>

            {hasAddOns && (
              <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(7,45,72,0.32)] backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                      Enhance Your Ritual
                    </h3>
                    <p className="mt-1 text-xs text-white/55">Add finishing touches to personalize the experience.</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/65">
                    {selectedAddOns.size > 0 ? `${selectedAddOns.size} selected` : 'Optional'}
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {addOnList.map((addOn) => {
                    const isSelected = selectedAddOns.has(addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        type="button"
                        onClick={() => handleAddOnToggle(addOn.id)}
                        className={[
                          'w-full rounded-2xl border px-5 py-4 text-left transition-all',
                          isSelected
                            ? 'border-brand-400 bg-brand-500/15 text-white shadow-[0_18px_45px_rgba(29,160,230,0.22)]'
                            : 'border-white/12 bg-white/5 text-white/80 hover:border-white/25 hover:text-white',
                        ].join(' ')}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">{addOn.name}</p>
                            <p className="text-xs text-white/60">{addOn.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-brand-200">
                              +{formatCurrency(addOn.price, service.currency)}
                            </p>
                            <p className="text-xs text-white/45">{addOn.duration} min</p>
                          </div>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                          <span
                            className={[
                              'flex h-5 w-5 items-center justify-center rounded-full border',
                              isSelected
                                ? 'border-brand-300 bg-brand-400/30 text-white'
                                : 'border-white/30 bg-transparent text-white/40',
                            ].join(' ')}
                          >
                            {isSelected ? '✓' : ''}
                          </span>
                          {isSelected ? 'Added to session' : 'Tap to add'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
            {!hasAddOns && (
              <section className="rounded-[32px] border border-white/8 bg-white/3 p-6 text-sm text-white/70 shadow-[0_18px_40px_rgba(7,45,72,0.2)] backdrop-blur">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
                  Enhance Your Ritual
                </h3>
                <p className="mt-2 text-xs text-white/50">
                  Personalized enhancements are currently unavailable for this session. Let us know if you need custom
                  requests.
                </p>
              </section>
            )}

            <section id="booking-section" className="treatment-booking rounded-[32px] border border-brand-400/30 bg-gradient-to-br from-brand-500/20 to-brand-600/10 p-6 shadow-[0_32px_80px_rgba(29,160,230,0.28)]">
              <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-lg font-semibold uppercase tracking-[0.25em] text-white">
                  Reserve Your Session
                </h2>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  {intent === 'book' ? 'Booking Mode' : 'Preview Mode'}
                </span>
              </header>

                {service.bookableDates?.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Preferred Date</p>
                    <div className="flex flex-wrap gap-3">
                    {service.bookableDates.map((dateOption) => {
                      // Convert date to ISO for comparison
                      const dateValue = convertDateLabelToISO(dateOption.value) || dateOption.value;
                      const isActive = selectedDate === dateValue || selectedDate === dateOption.value;
                      
                      // Check if this date/time combination is in the past
                      // If no time selected yet, allow the date (time will be validated later)
                      const isPast = dateValue && selectedTime ? isPastDateTime(dateValue, selectedTime) : false;
                      
                      return (
                        <button
                          key={`${service.id}-${dateOption.value}`}
                          type="button"
                          onClick={() => {
                            const isoDate = convertDateLabelToISO(dateOption.value) || dateOption.value;
                            
                            // If the selected date with current time would be in the past, adjust time
                            if (isoDate && selectedTime && isPastDateTime(isoDate, selectedTime)) {
                              // Keep the date but the time validation will catch it
                              // Or we could auto-adjust to next available time
                              setSelectedDate(isoDate);
                              // Show a warning or auto-adjust time
                              setBookingError('Selected time may be in the past. Please select a future time.');
                            } else {
                              setSelectedDate(isoDate);
                              setBookingError(''); // Clear any previous errors
                            }
                          }}
                          disabled={isPast}
                          className={[
                            'rounded-2xl px-4 py-2 text-sm font-semibold transition-all',
                            isPast
                              ? 'border border-white/10 bg-white/5 text-white/30 cursor-not-allowed opacity-50'
                              : isActive
                              ? 'bg-white text-brand-700 shadow-[0_12px_30px_rgba(255,255,255,0.35)]'
                              : 'border border-white/25 bg-white/10 text-white/75 hover:border-white/40 hover:text-white',
                          ].join(' ')}
                        >
                          {dateOption.label}
                        </button>
                      );
                    })}
                    </div>
                  </div>
                )}

                {service.timeSlots?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Preferred Time</p>
                    <div className="flex flex-wrap gap-3">
                    {service.timeSlots.map((timeOption) => {
                      const isActive = selectedTime === timeOption;
                      // Check if this time with selected date would be in the past
                      const isPast = selectedDate && isPastDateTime(selectedDate, timeOption);
                      
                      return (
                        <button
                          key={`${service.id}-${timeOption}`}
                          type="button"
                          onClick={() => {
                            // Validate the time is not in the past
                            if (selectedDate && isPastDateTime(selectedDate, timeOption)) {
                              setBookingError('This time is in the past. Please select a future time.');
                            } else {
                              setSelectedTime(timeOption);
                              setBookingError(''); // Clear any previous errors
                            }
                          }}
                          disabled={isPast}
                          className={[
                            'rounded-2xl px-4 py-2 text-sm font-semibold transition-all',
                            isPast
                              ? 'border border-white/10 bg-white/5 text-white/30 cursor-not-allowed opacity-50'
                              : isActive
                              ? 'bg-white text-brand-700 shadow-[0_12px_30px_rgba(255,255,255,0.35)]'
                              : 'border border-white/25 bg-white/10 text-white/75 hover:border-white/40 hover:text-white',
                          ].join(' ')}
                        >
                          {timeOption}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Guest Details
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                      Full Name (optional)
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      className="w-full rounded-2xl border border-white/30 bg-white/10 p-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                      placeholder="Tana Beauty"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(event) => setGuestPhone(event.target.value)}
                      className="w-full rounded-2xl border border-white/30 bg-white/10 p-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                      placeholder="+27 00 000 0000"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Email (required for confirmation)
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/30 bg-white/10 p-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                    placeholder="guest@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Notes for Your Therapist (Optional)
                  </p>
                  <textarea
                    value={guestNote}
                    onChange={(event) => setGuestNote(event.target.value)}
                    rows={3}
                    placeholder="Share preferences, focus areas, or celebration details."
                  className="w-full rounded-2xl border border-white/30 bg-white/10 p-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
            </div>

              <div className="mt-6 rounded-[24px] border border-white/20 bg-white/10 px-5 py-4 text-sm text-white/80 backdrop-blur">
                <div className="flex items-center justify-between">
                <span>Service Investment</span>
                <span>{formatCurrency(service.basePrice, service.currency)}</span>
              </div>
              {addOnTotal > 0 && (
                  <div className="mt-2 flex items-center justify-between text-white/75">
                  <span>Enhancements</span>
                  <span>{formatCurrency(addOnTotal, service.currency)}</span>
                </div>
              )}
                <div className="mt-3 flex items-center justify-between text-base font-semibold text-white">
                  <span>Total Due</span>
                <span>{formatCurrency(totalPrice, service.currency)}</span>
                </div>
              </div>

              {bookingError && (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">{bookingError}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Button
                  onClick={(e) => {
                    // If date/time not selected, show requirements modal
                    if (!selectedDate || !selectedTime) {
                      e?.preventDefault();
                      e?.stopPropagation();
                      setShowRequirementsModal(true);
                      return;
                    }
                    
                    // If date/time are selected, proceed with booking
                    handleBook(e);
                  }}
                  className={`w-full justify-center py-4 text-base font-semibold ${
                    (!selectedDate || !selectedTime) 
                      ? 'cursor-pointer hover:opacity-90' 
                      : ''
                  }`}
                  type="button"
                  aria-label={intent === 'book' ? 'Confirm your booking' : 'Reserve this service'}
                >
                  {(!selectedDate || !selectedTime) ? 'Select Date & Time' : (intent === 'book' ? 'Confirm Booking' : 'Reserve This Service')}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    onClose();
                  }} 
                  className="w-full justify-center py-4 text-base font-semibold"
                  aria-label="Close and decide later"
                >
                  Decide Later
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Requirements Modal */}
      {showRequirementsModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="requirements-modal-title"
        >
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            onClick={() => setShowRequirementsModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-slate-800/95 backdrop-blur-md border border-white/10 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowRequirementsModal(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
                <h3 id="requirements-modal-title" className="text-xl font-bold uppercase tracking-wide text-white">
                  COMPLETE YOUR BOOKING
                </h3>
              </div>
              <p className="text-sm text-white/90">
                Select your preferred date and time to proceed with your booking.
              </p>
            </div>

            {/* Date Selection */}
            {service?.bookableDates?.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
                  Preferred Date
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.bookableDates.map((dateOption) => {
                    const isActive = selectedDate === dateOption.value;
                    return (
                      <button
                        key={`modal-${service.id}-${dateOption.value}`}
                        type="button"
                        onClick={() => setSelectedDate(dateOption.value)}
                        className={[
                          'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                          isActive
                            ? 'bg-white text-slate-800 shadow-lg'
                            : 'border border-white/25 bg-white/10 text-white/75 hover:border-white/40 hover:text-white',
                        ].join(' ')}
                      >
                        {dateOption.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Time Selection */}
            {service?.timeSlots?.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
                  Preferred Time
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.timeSlots.map((timeOption) => {
                    const isActive = selectedTime === timeOption;
                    return (
                      <button
                        key={`modal-${service.id}-${timeOption}`}
                        type="button"
                        onClick={() => setSelectedTime(timeOption)}
                        className={[
                          'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                          isActive
                            ? 'bg-white text-slate-800 shadow-lg'
                            : 'border border-white/25 bg-white/10 text-white/75 hover:border-white/40 hover:text-white',
                        ].join(' ')}
                      >
                        {timeOption}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pricing Summary */}
            {(selectedDate && selectedTime) && (
              <div className="mb-4 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span>Service Investment</span>
                  <span>{formatCurrency(service?.basePrice || 0, service?.currency || 'USD')}</span>
                </div>
                {addOnTotal > 0 && (
                  <div className="mt-2 flex items-center justify-between text-white/75">
                    <span>Enhancements</span>
                    <span>{formatCurrency(addOnTotal, service?.currency || 'USD')}</span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between text-base font-semibold text-white border-t border-white/10 pt-3">
                  <span>Total Due</span>
                  <span>{formatCurrency(totalPrice, service?.currency || 'USD')}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {(!selectedDate || !selectedTime) ? (
                <button
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    
                    // Close the requirements modal first
                    setShowRequirementsModal(false);
                    
                    // Scroll to booking section after a brief delay to ensure modal is closed
                    setTimeout(() => {
                      const bookingSection = document.getElementById('booking-section') || document.querySelector('.treatment-booking');
                      if (bookingSection) {
                        // Scroll the modal container to show the booking section
                        const modalContainer = bookingSection.closest('.service-modal-container');
                        if (modalContainer) {
                          // Calculate the position relative to the modal container
                          const containerRect = modalContainer.getBoundingClientRect();
                          const sectionRect = bookingSection.getBoundingClientRect();
                          const scrollTop = modalContainer.scrollTop;
                          const targetScroll = scrollTop + (sectionRect.top - containerRect.top) - 100; // 100px offset from top
                          
                          modalContainer.scrollTo({
                            top: targetScroll,
                            behavior: 'smooth'
                          });
                          
                          // Add highlight effect
                          bookingSection.style.transition = 'box-shadow 0.3s ease';
                          bookingSection.style.boxShadow = '0 0 0 3px rgba(29, 160, 230, 0.5), 0_32px_80px_rgba(29,160,230,0.28)';
                          setTimeout(() => {
                            bookingSection.style.boxShadow = '';
                          }, 2000);
                        } else {
                          // Fallback: scroll the section into view
                          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          // Add highlight effect
                          bookingSection.style.transition = 'box-shadow 0.3s ease';
                          bookingSection.style.boxShadow = '0 0 0 3px rgba(29, 160, 230, 0.5), 0_32px_80px_rgba(29,160,230,0.28)';
                          setTimeout(() => {
                            bookingSection.style.boxShadow = '';
                          }, 2000);
                        }
                      }
                    }, 150);
                  }}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-4 text-base transition-all duration-200 shadow-lg"
                  type="button"
                  aria-label="Go to date and time selection"
                >
                  Select Date & Time
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    
                    if (!service) {
                      logger.error('Cannot book: Service is missing');
                      return;
                    }
                    
                    // Process the booking
                    // handleBook will call onBook which will close the service modal
                    // The requirements modal will be closed when the service modal closes
                    handleBook(e);
                  }}
                  disabled={!selectedDate || !selectedTime || !service}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-4 text-base transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  aria-label="Confirm your booking"
                >
                  Confirm Booking
                </button>
              )}
              <button
                onClick={() => setShowRequirementsModal(false)}
                className="w-full rounded-xl bg-slate-700/80 hover:bg-slate-700 border border-white/20 text-white font-semibold py-3 px-4 text-sm transition-all duration-200"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
