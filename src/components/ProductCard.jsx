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

export function ProductCard({ product }) {
  const [imageSrc, setImageSrc] = useState(product.image || fallbackImage);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-ocean/50 border border-white/8 backdrop-blur-sm transition hover:-translate-y-1 hover:border-brand-400/40">
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
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
      <div className="flex flex-col gap-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300">{product.category}</p>
          <h3 className="mt-2 font-display text-xl text-white">{product.name}</h3>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-white">{product.price}</span>
          <Button variant="secondary">View Details</Button>
        </div>
      </div>
    </article>
  );
}
