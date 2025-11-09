import { useEffect, useMemo, useRef } from 'react';
import { testimonials } from '../data/testimonials.js';

const extendedTestimonials = [
  ...testimonials,
  {
    id: 'client-05',
    name: 'Naledi S.',
    title: 'Retail sell-through in days',
    testimonial:
      'Our boutique pop-ups sold out twice as fast once the Blue Ocean capsule kits arrived with visuals, pricing, and display suggestions ready to go.',
  },
  {
    id: 'client-06',
    name: 'Luca M.',
    title: 'Spa revenue uplift',
    testimonial:
      'Tana’s rituals helped us add premium treatments that guests rave about. Bundled take-home rituals boosted our retail basket size 35%.',
  },
  {
    id: 'client-07',
    name: 'Amélie T.',
    title: 'Effortless onboarding',
    testimonial:
      'Within a week our team had merchandising, scent playlists, and guest emails ready. Everything felt cohesive from lobby to treatment rooms.',
  },
  {
    id: 'client-08',
    name: 'Kwame D.',
    title: 'Data we can act on',
    testimonial:
      'Same-day analytics show which capsules and rituals resonate. We update menus and merchandising instantly, keeping momentum with every launch.',
  },
];

const colors = [
  { text: '#2B1A0C', background: '#FFE9C7' },
  { text: '#1E2B36', background: '#CBE8FF' },
  { text: '#2F1C3A', background: '#F6E4FF' },
  { text: '#1F2F2B', background: '#CFFFE4' },
];

export function Testimonials() {
  const containerRef = useRef(null);
  const offsets = useMemo(
    () => extendedTestimonials.map((_, index) => index - (extendedTestimonials.length - 1) / 2),
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const updateTilt = (event) => {
      const rect = container.getBoundingClientRect();
      const progressX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const progressY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      container.style.setProperty('--tilt-x', `${(progressX * 14).toFixed(2)}px`);
      container.style.setProperty('--tilt-y', `${(progressY * 20).toFixed(2)}px`);
      container.style.setProperty('--tilt-scale', `${Math.min(Math.abs(progressY) + Math.abs(progressX), 1).toFixed(3)}`);
    };

    const resetTilt = () => {
      container.style.setProperty('--tilt-x', '0px');
      container.style.setProperty('--tilt-y', '0px');
      container.style.setProperty('--tilt-scale', '0');
    };

    resetTilt();
    container.addEventListener('pointermove', updateTilt);
    container.addEventListener('pointerleave', resetTilt);

    return () => {
      container.removeEventListener('pointermove', updateTilt);
      container.removeEventListener('pointerleave', resetTilt);
    };
  }, []);

  return (
    <section
      id="journal"
      className="relative mx-auto mt-24 max-w-none px-0 pb-24"
      ref={containerRef}
      style={{ '--tilt-x': '0px', '--tilt-y': '0px', '--tilt-scale': '0' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80"
          alt="Hear it from our clients"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/85 via-midnight/80 to-midnight/90" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex justify-center text-center text-brand-200">
          <h2 className="mt-20 mb-16 font-display text-3xl sm:text-4xl">
            Customer testimonials
          </h2>
        </div>
        <ul className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-white">
          {extendedTestimonials.map((testimonial, index) => {
            const palette = colors[index % colors.length];
            const initials = testimonial.name
              .split(' ')
              .filter(Boolean)
              .map((part) => part[0]?.toUpperCase())
              .slice(0, 2)
              .join('');

            const offset = offsets[index];
            const translateX = `calc(var(--tilt-x) * ${0.35 * offset})`;
            const translateY = `calc(var(--tilt-y) * ${0.6 + Math.abs(offset) * 0.25})`;
            const scale = `calc(1 - var(--tilt-scale) * ${0.06 + Math.abs(offset) * 0.02})`;

            return (
              <li
                key={testimonial.id}
                className="will-change-transform"
                style={{
                  transform: `translate3d(${translateX}, ${translateY}, 0) scale(${scale})`,
                  transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div className="flex h-full flex-col rounded-[28px] border border-white/12 bg-white/10 p-6 shadow-[0_20px_45px_rgba(4,11,24,0.45)] backdrop-blur-md transition hover:border-white/25 hover:bg-white/15">
                  <p className="text-sm font-semibold text-white">
                    {testimonial.title || testimonial.headline || 'Recommended'}
                  </p>
                  <p className="mt-4 text-sm text-white/75">
                    {testimonial.quote || testimonial.testimonial}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold uppercase"
                      style={{
                        color: palette.text,
                        backgroundColor: palette.background,
                      }}
                    >
                      {initials || 'BO'}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
