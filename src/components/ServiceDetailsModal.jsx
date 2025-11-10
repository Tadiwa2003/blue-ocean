import { useEffect, useMemo, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button.jsx';
import {
  buildYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
} from '../utils/youtube.js';
import { ChevronLeft, ChevronRight, Star, Check, Clock, Sparkles } from 'lucide-react';

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
  const [videoError, setVideoError] = useState(false);
  const [videoEmbedUrl, setVideoEmbedUrl] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
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
      setSelectedDate(service.bookableDates?.[0]?.value || '');
      setSelectedTime(service.timeSlots?.[0] || '');
      setSelectedAddOns(new Set());
      setGuestNote('');
      setVideoError(false);
      setActiveTab('overview');

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

  const handleBook = () => {
    if (!service || !selectedDate || !selectedTime) {
      return;
    }

    if (onBook) {
      onBook(service, {
        date: selectedDate,
        time: selectedTime,
        addOns: Array.from(selectedAddOns),
        notes: guestNote.trim(),
        addOnTotal,
        totalPrice,
      });
    }
  };

  if (!open || !service) return null;

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

      <div className="absolute inset-0 modal-backdrop" onClick={onClose} />

      <div ref={containerRef} className="relative w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-ocean/95 to-midnight/98 shadow-2xl modal-content">
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

        <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative bg-gradient-to-br from-ocean/60 to-midnight/90 p-6 sm:p-8 lg:p-10">
            <div className="space-y-8 lg:sticky lg:top-10">
              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_35px_90px_rgba(7,45,72,0.45)] group">
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
          </div>

          <div className="flex flex-col gap-8 bg-gradient-to-bl from-midnight/95 to-ocean/60 p-6 sm:p-8 lg:p-10">
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

            <section className="rounded-[32px] border border-brand-400/30 bg-gradient-to-br from-brand-500/20 to-brand-600/10 p-6 shadow-[0_32px_80px_rgba(29,160,230,0.28)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
                  Reserve Your Session
                </h3>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  {intent === 'book' ? 'Booking Mode' : 'Preview Mode'}
                </span>
              </div>

                {service.bookableDates?.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Preferred Date</p>
                    <div className="flex flex-wrap gap-3">
                    {service.bookableDates.map((dateOption) => {
                      const isActive = selectedDate === dateOption.value;
                      return (
                        <button
                          key={`${service.id}-${dateOption.value}`}
                          type="button"
                          onClick={() => setSelectedDate(dateOption.value)}
                          className={[
                            'rounded-2xl px-4 py-2 text-sm font-semibold transition-all',
                            isActive
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
                      return (
                        <button
                          key={`${service.id}-${timeOption}`}
                          type="button"
                          onClick={() => setSelectedTime(timeOption)}
                          className={[
                            'rounded-2xl px-4 py-2 text-sm font-semibold transition-all',
                            isActive
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

              <div className="mt-6 space-y-3">
              <Button
                onClick={handleBook}
                className="w-full justify-center py-4 text-base"
                disabled={!selectedDate || !selectedTime}
              >
                {intent === 'book' ? 'Confirm Booking' : 'Reserve This Service'}
              </Button>
                <Button variant="secondary" onClick={onClose} className="w-full justify-center py-4 text-base">
                Decide Later
              </Button>
            </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
