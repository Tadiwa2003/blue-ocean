import { Button } from '../components/Button.jsx';

// Inline base64 encoded gradient as guaranteed fallback
const FALLBACK_GRADIENT = 
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGIyMzNlO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZGEwZTY7c3RvcC1vcGFjaXR5OjAuNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzA0MGIxODtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-32">
      {/* Background image layer - with robust runtime fallbacks */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1920&q=80"
          data-fallback-index="0"
          alt="Till operator serving a client at checkout"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          style={{ backgroundColor: '#0b233e', objectPosition: '35% center', filter: 'brightness(1.1) contrast(1.03)' }}
          onError={(e) => {
            const sources = [
              'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1920&q=80', // POS payment close-up
              'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=1920&q=80', // boutique shopping with people
              'https://images.unsplash.com/photo-1505575972945-2104479a8ef3?auto=format&fit=crop&w=1920&q=80', // spa products / stones (contextual)
              '/assets/images/hero-bg.jpg',
              FALLBACK_GRADIENT,
            ];
            const currentIndex = Number(e.currentTarget.getAttribute('data-fallback-index') || '0');
            const nextIndex = Math.min(currentIndex, sources.length - 1);
            e.currentTarget.setAttribute('data-fallback-index', String(nextIndex + 1));
            e.currentTarget.src = sources[nextIndex];
          }}
        />
      </div>
      {/* Overlay gradients for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-midnight/25 via-midnight/12 to-transparent" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_top_left,_rgba(29,160,230,0.12),_transparent_60%)]" />
      <div className="relative z-30 mx-auto max-w-6xl px-6 pb-20 pt-24 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-midnight/45 p-8 text-left shadow-[0_30px_60px_rgba(4,11,24,0.35)] backdrop-blur-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
              Curated Products · Signature Spa Rituals
            </span>
            <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl md:text-[44px] md:leading-tight">
              Blue Ocean supplies coastal-luxury merchandise and beauty spa experiences that sell through and soothe.
            </h1>
            <p className="max-w-2xl text-base text-white/75 md:text-lg">
              Source ready-to-style totes, resort footwear, and skincare while offering guests restorative spa rituals designed by our shoreline artisans.
              Every product and treatment comes with story-driven assets for retail and wellness lounges.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button>Shop Signature Collection</Button>
              <Button variant="secondary">Book Spa Ritual Menu</Button>
              <Button variant="ghost" className="px-4" onClick={() => document.querySelector('#intro')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn more
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-midnight/75 p-6 text-left shadow-[0_25px_45px_rgba(4,11,24,0.5)] backdrop-blur-xl">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/25 blur-3xl" />
              <div className="absolute -left-24 bottom-0 h-32 w-32 rounded-full bg-brand-300/20 blur-3xl" />
              <div className="relative flex flex-col gap-4">
                <span className="w-fit rounded-full border border-brand-400/40 bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-100">
                  Storefront Spotlight
                </span>
                <h3 className="font-display text-2xl text-white">Lamu Boutique Partners</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                Recently sold out of the Sea Glass Tote capsule within 72 hours of launch, pairing retail with our Oceanstone Glow facial ritual.
                We supply launch kits, merchandising scripts, and tasting notes for every drop.
              </p>
                <div className="grid grid-cols-2 gap-3 text-sm text-white/75">
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-center">
                    <span className="block text-[11px] uppercase tracking-[0.35em] text-brand-200">AOV Lift</span>
                    <span className="mt-1 block text-lg font-semibold text-white">+18%</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-center">
                    <span className="block text-[11px] uppercase tracking-[0.35em] text-brand-200">Guest Score</span>
                    <span className="mt-1 block text-lg font-semibold text-white">4.9 / 5</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-3 text-xs text-white/60">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-brand-400" />
                    VIP Retail Support
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-brand-300" />
                    72hr Sell-through
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-30 mx-auto -mt-6 grid w-full max-w-6xl grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-white shadow-[0_25px_50px_rgba(4,11,24,0.35)] backdrop-blur sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Curated Brands</dt>
          <dd className="mt-2 text-2xl font-semibold">24+</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Spa Rituals</dt>
          <dd className="mt-2 text-2xl font-semibold">12</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Global Orders</dt>
          <dd className="mt-2 text-2xl font-semibold">18K</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Satisfaction</dt>
          <dd className="mt-2 text-2xl font-semibold">4.9/5</dd>
        </div>
      </div>
    </section>
  );
}
