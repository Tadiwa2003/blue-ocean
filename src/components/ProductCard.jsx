import { useState } from 'react';
import { Button } from './Button.jsx';

const fallbackImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f5f5f5" />
          <stop offset="100%" stop-color="#e0e0e0" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#grad)" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="rgba(0,0,0,0.3)">
        No Image
      </text>
    </svg>
  `);

export function ProductCard({ product, onViewDetails, onAddToCart, theme }) {
  const [imageSrc, setImageSrc] = useState(product.image || fallbackImage);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const cardTheme = {
    background: theme?.card?.background || 'rgba(11,35,62,0.7)',
    border: theme?.card?.border || 'rgba(255,255,255,0.08)',
    shadow:
      theme?.card?.shadow || '0 20px 60px rgba(29,160,230,0.3)',
    accent: theme?.accent || '#1da0e6',
  };

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
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm border border-gray-200/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10">
      {/* Image Container with Zoom Effect */}
      <div className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-gray-50" onClick={handleViewDetails}>
        <img
          src={imageSrc}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
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
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute inset-x-4 top-4 flex gap-2">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-3 p-5">
        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price and Actions Row */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl font-bold text-gray-900">
            {product.price ? (
              typeof product.price === 'string' ? product.price : `$${Number(product.price).toFixed(2)}`
            ) : product.basePrice ? (
              `$${Number(product.basePrice).toFixed(2)}`
            ) : (
              <span className="text-gray-400 text-lg">Price unavailable</span>
            )}
          </span>
          <Button
            variant="secondary"
            onClick={handleViewDetails}
            className="text-xs px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300"
          >
            View
          </Button>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full justify-center bg-black hover:bg-gray-800 text-white border-0"
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
    </article>
  );
}
