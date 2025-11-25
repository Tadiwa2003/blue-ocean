import { Button } from '../components/Button.jsx';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

// Inline base64 encoded gradient as guaranteed fallback
const FALLBACK_GRADIENT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGIyMzNlO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZGEwZTY7c3RvcC1vcGFjaXR5OjAuNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzA0MGIxODtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

export function Hero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section ref={sectionRef} id="hero" className="relative overflow-hidden pt-32">
      {/* Background with Spline 3D */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80"
          data-fallback-index="0"
          alt="Coastal retail boutique with spa lounge"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          style={{ backgroundColor: '#0b233e', objectPosition: 'center 45%', filter: 'brightness(0.92) contrast(1.05)' }}
          onError={(e) => {
            const sources = [
              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1505575972945-2104479a8ef3?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1920&q=80',
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
      
      {/* Soft gradient overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-midnight/80 via-midnight/60 to-midnight/30" />
      <div className="absolute inset-0 z-20 hero-ring-animation bg-[radial-gradient(circle_at_top_left,_rgba(27,152,224,0.2),_transparent_60%)]" />

      <div className="relative z-30 mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-1 backdrop-blur">
              <p className="text-xs font-sans text-brand-100 font-semibold uppercase tracking-[0.35em] m-0">
                Welcome to BrightPath
              </p>
            </div>
            <h1 className="text-left max-w-3xl font-display text-[2.75rem] leading-tight sm:text-[3.1rem] font-semibold sm:font-medium tracking-tight m-0 text-white">
              The All-in-One Digital Marketplace Platform
            </h1>
            <div className="space-y-4">
              <p className="max-w-2xl text-left text-base md:text-lg font-sans text-white/90 font-normal leading-relaxed m-0">
                <strong className="text-brand-200">BrightPath</strong> is your comprehensive digital marketplace solution that empowers businesses to thrive online. We provide a powerful platform for entrepreneurs and merchants to launch, manage, and grow their digital storefronts with ease.
              </p>
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-300">Our Joint Venture Businesses:</h3>
                <div className="space-y-2 pl-4 border-l-2 border-brand-400/30">
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-400 flex-shrink-0" />
                    <p className="text-sm text-white/85 leading-relaxed m-0">
                      <strong className="text-white">Tana's Beauty Boost Spa</strong> – Premium wellness and beauty services featuring luxury treatments, therapeutic massages, rejuvenating facials, and complete wellness packages
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-400 flex-shrink-0" />
                    <p className="text-sm text-white/85 leading-relaxed m-0">
                      <strong className="text-white">BrightPath Merchant Store</strong> – Curated marketplace for quality products with integrated inventory management, payment processing, and merchant rental options
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Button onClick={() => {
                const retailSection = document.getElementById('retail');
                if (retailSection) {
                  retailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}>
                Explore BrightPath Capsules
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const spaSection = document.getElementById('spa');
                  if (spaSection) {
                    spaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                View Tana&apos;s Spa Menu
              </Button>
              <Button
                variant="ghost"
                className="px-4"
                onClick={() => {
                  const introSection = document.getElementById('intro');
                  if (introSection) {
                    introSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                How it works
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60"
            >
              <a
                href="#cta"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <span className="text-xl"></span>
                <span>Download on the App Store</span>
              </a>
              <a
                href="#cta"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <span className="text-lg">▶</span>
                <span>Get it on BrightPath Play</span>
              </a>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-[32px] border border-white/15 bg-midnight/75 p-6 shadow-[0_25px_45px_rgba(4,11,24,0.45)] backdrop-blur-xl">
              <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-brand-300/20 blur-3xl" />
              <div className="relative space-y-4 text-left text-white">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/40 bg-brand-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-200">
                  Joint Venture #1
                </span>
                <h2 className="font-display text-2xl font-semibold">Tana's Beauty Boost Spa</h2>
                <p className="text-sm text-white/85 leading-relaxed font-medium">
                  Premium Wellness & Beauty Services
                </p>
                <p className="text-sm text-white/75 leading-relaxed">
                  Experience luxury beauty and spa treatments designed to rejuvenate and restore. From therapeutic massages to advanced skincare, we offer a complete wellness experience tailored to your needs.
                </p>
                <ul className="space-y-2.5 text-xs text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-300 flex-shrink-0" />
                    <span>Professional spa treatments & wellness packages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-300 flex-shrink-0" />
                    <span>Online booking system with real-time availability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-300 flex-shrink-0" />
                    <span>Gift cards, memberships & loyalty rewards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-300 flex-shrink-0" />
                    <span>Customized treatment plans for every client</span>
                  </li>
                </ul>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/8 p-6 shadow-[0_25px_45px_rgba(4,11,24,0.4)] backdrop-blur-xl">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/20 blur-3xl" />
              <div className="relative space-y-4 text-left text-white">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-200">
                  Joint Venture #2
                </span>
                <h2 className="font-display text-2xl font-semibold">BrightPath Merchant Store</h2>
                <p className="text-sm text-white/85 leading-relaxed font-medium">
                  Your Digital Storefront Solution
                </p>
                <p className="text-sm text-white/75 leading-relaxed">
                  Launch and manage your online store with our comprehensive merchant platform. Sell products, track inventory, process payments, and grow your business—all in one place.
                </p>
                <ul className="space-y-2.5 text-xs text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    <span>Complete inventory & product management system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    <span>Integrated payment processing & order tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    <span>Rent our platform to other merchants & earn revenue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    <span>Analytics dashboard with sales insights & reports</span>
                  </li>
                </ul>
              </div>
            </article>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-30 mx-auto -mt-4 grid w-full max-w-6xl gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-white shadow-[0_25px_50px_rgba(4,11,24,0.35)] backdrop-blur sm:grid-cols-4"
      >
        {[
          { label: 'Retail partners', value: '320+' },
          { label: 'Spa rituals curated', value: '18' },
          { label: 'Sell-through in 72 hrs', value: '82%' },
          { label: 'Guest satisfaction', value: '4.9 / 5' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
          >
            <dt className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</dt>
            <dd className="mt-2 text-2xl font-semibold">{stat.value}</dd>
          </motion.div>
        ))}
      </motion.div>
      <div className="relative z-30 mt-8 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/15 hover:text-white"
          onClick={() => document.querySelector('#retail')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Scroll
          <span className="text-white">⌄</span>
        </button>
      </div>
    </section>
  );
}