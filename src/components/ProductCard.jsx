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
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" fill="rgba(255,255,255,0.85)">
        Blue Ocean
      </text>
    </svg>
  `);

export function ProductCard({ product, onViewDetails, onAddToCart }) {
  const [imageSrc, setImageSrc] = useState(product.image || fallbackImage);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering view details
    if (onAddToCart) {
      setIsAdding(true);
      onAddToCart(product);
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-ocean/50 border border-white/8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-brand-400/40 hover:shadow-[0_20px_60px_rgba(29,160,230,0.3)]">
      <div className="relative h-56 overflow-hidden cursor-pointer" onClick={handleViewDetails}>
        <img
          src={imageSrc}
          alt={product.name}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setImageSrc(fallbackImage);
            setIsLoaded(true);
          }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-brand-500/15 via-brand-400/10 to-ocean/20" />
        )}
        <div className="absolute inset-x-4 top-4 flex gap-2">
          {product.badges?.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 min-h-[200px]">
        {/* Top row: Price and View Details */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {product.price ? (
              typeof product.price === 'string' ? product.price : `$${Number(product.price).toFixed(2)}`
            ) : product.basePrice ? (
              `$${Number(product.basePrice).toFixed(2)}`
            ) : (
              <span className="text-white/60">Price unavailable</span>
            )}
          </span>
          <Button variant="secondary" onClick={handleViewDetails} className="text-xs px-3 py-1.5">
            View Details
          </Button>
        </div>
        
        {/* Main Add to Cart Button */}
        <div className="flex-1 flex items-end">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full justify-center"
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdding ? (
              <>
                <svg className="h-4 w-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Added!</span>
              </>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
