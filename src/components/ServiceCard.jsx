import { useState } from 'react';
import { Button } from './Button.jsx';

const fallbackImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320">
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1da0e6" />
          <stop offset="100%" stop-color="#0b233e" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#grad)" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="rgba(255,255,255,0.85)">
        Spa Service
      </text>
    </svg>
  `);

const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export function ServiceCard({ service, onViewDetails, onBook }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(service.image || fallbackImage);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(service);
    }
  };

  const handleBook = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log('🔘 Book Session button clicked', {
      serviceName: service?.name,
      hasOnBook: !!onBook,
      hasOnViewDetails: !!onViewDetails,
    });
    
    if (onBook) {
      console.log('📞 Calling onBook handler');
      onBook(service);
    } else if (onViewDetails) {
      console.log('📞 Falling back to onViewDetails');
      onViewDetails(service, 'book');
    } else {
      console.warn('⚠️ No booking handler available');
    }
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-brand-400/40 hover:shadow-[0_20px_60px_rgba(29,160,230,0.3)]">
      <div className="relative h-56 cursor-pointer overflow-hidden" onClick={handleViewDetails}>
        <img
          src={imageSrc}
          alt={service.name}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => {
            setImageSrc(fallbackImage);
            setIsImageLoaded(true);
          }}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-brand-500/15 via-brand-400/10 to-ocean/20" />
        )}

        <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2">
          {service.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-brand-300 transition-colors group-hover:text-brand-200">
            <span>{service.serviceCategory}</span>
            <span className="text-white/60 transition-colors group-hover:text-white/80">{service.duration} min</span>
          </div>
          <h3 className="font-display text-xl text-white transition-all group-hover:text-brand-100">{service.name}</h3>
          <p className="text-sm leading-relaxed text-white/70 transition-colors group-hover:text-white/80">
            {service.headline || service.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="text-brand-200">💠</span>
              <span>{service.therapistLevel}</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-brand-100">
              {formatCurrency(service.basePrice, service.currency)}
            </span>
            <Button variant="secondary" onClick={handleViewDetails}>
              View Treatment
            </Button>
          </div>
          <Button 
            onClick={handleBook} 
            className="w-full justify-center"
            type="button"
            aria-label={`Book ${service.name} session`}
          >
            Book Session
          </Button>
        </div>
      </div>
    </article>
  );
}
