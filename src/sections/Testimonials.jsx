import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { testimonials } from '../data/testimonials.js';

const extendedTestimonials = [
  ...testimonials,
  {
    id: 'client-05',
    name: 'Naledi S.',
    title: 'Retail sell-through in days',
    testimonial:
      'Our boutique pop-ups sold out twice as fast once the BrightPath capsule kits arrived with visuals, pricing, and display suggestions ready to go.',
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

const countryFlags = [
  '🇦🇫', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿',
  '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇶', '🇧🇦', '🇧🇼', '🇧🇷', '🇮🇴', '🇻🇬',
  '🇧🇳', '🇧🇬', '🇧🇫', '🇧🇮', '🇰🇭', '🇨🇲', '🇨🇦', '🇨🇻', '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳', '🇨🇽', '🇨🇨', '🇨🇴',
  '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇰', '🇨🇷', '🇭🇷', '🇨🇺', '🇨🇼', '🇨🇾', '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇲', '🇩🇴', '🇪🇨', '🇪🇬', '🇸🇻',
  '🇬🇶', '🇪🇷', '🇪🇪', '🇸🇿', '🇪🇹', '🇫🇰', '🇫🇴', '🇫🇯', '🇫🇮', '🇫🇷', '🇬🇫', '🇵🇫', '🇵🇲', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪',
  '🇬🇭', '🇬🇮', '🇬🇷', '🇬🇱', '🇬🇩', '🇬🇺', '🇬🇹', '🇬🇬', '🇬🇳', '🇬🇼', '🇬🇾', '🇭🇹', '🇭🇳', '🇭🇰', '🇭🇺', '🇮🇸', '🇮🇳',
  '🇮🇩', '🇮🇷', '🇮🇶', '🇮🇪', '🇮🇲', '🇮🇱', '🇮🇹', '🇨🇮', '🇯🇲', '🇯🇵', '🇯🇪', '🇯🇴', '🇰🇿', '🇰🇪', '🇰🇮', '🇽🇰', '🇰🇼',
  '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸', '🇱🇷', '🇱🇾', '🇱🇮', '🇱🇹', '🇱🇺', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾', '🇲🇻', '🇲🇱',
  '🇲🇹', '🇲🇭', '🇲🇶', '🇲🇷', '🇲🇺', '🇾🇹', '🇲🇽', '🇫🇲', '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇦', '🇲🇿', '🇲🇲', '🇳🇦',
  '🇳🇷', '🇳🇵', '🇳🇱', '🇳🇨', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇫', '🇲🇵', '🇰🇵', '🇲🇰', '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇼',
  '🇵🇸', '🇵🇦', '🇵🇬', '🇵🇾', '🇵🇪', '🇵🇭', '🇵🇳', '🇵🇱', '🇵🇹', '🇵🇷', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇺', '🇷🇼', '🇸🇭', '🇰🇳',
  '🇱🇨', '🇻🇨', '🇼🇸', '🇸🇲', '🇸🇹', '🇸🇦', '🇸🇳', '🇷🇸', '🇸🇨', '🇸🇱', '🇸🇬', '🇸🇽', '🇸🇰', '🇸🇮', '🇸🇧', '🇸🇴', '🇿🇦',
  '🇬🇸', '🇰🇷', '🇸🇸', '🇪🇸', '🇱🇰', '🇸🇩', '🇸🇷', '🇸🇯', '🇸🇪', '🇨🇭', '🇸🇾', '🇹🇼', '🇹🇯', '🇹🇿', '🇹🇭', '🇹🇱', '🇹🇬',
  '🇹🇰', '🇹🇴', '🇹🇹', '🇹🇳', '🇹🇷', '🇹🇲', '🇹🇨', '🇹🇻', '🇺🇬', '🇺🇦', '🇦🇪', '🇬🇧', '🇺🇸', '🇺🇾', '🇺🇲', '🇺🇿', '🇻🇺',
  '🇻🇦', '🇻🇪', '🇻🇳', '🇻🇬', '🇻🇮', '🇼🇫', '🇪🇭', '🇾🇪', '🇿🇲', '🇿🇼'
];

const flagGradients = [
  'from-sky-500/90 to-sky-600/90',
  'from-rose-500/90 to-rose-600/90',
  'from-indigo-500/90 to-indigo-600/90',
  'from-emerald-500/90 to-emerald-600/90',
  'from-purple-500/90 to-purple-600/90',
  'from-amber-500/90 to-amber-600/90',
  'from-cyan-500/90 to-cyan-600/90',
  'from-lime-500/90 to-lime-600/90',
];

const BASE_ZONE_HEIGHT = 220;
const FLAG_SIZE = 64;
const SLOT_POSITIONS = Array.from({ length: 36 }, (_, index) => 6 + index * 2.5);
const MAX_TOTAL_FLAGS = 108;
const STACK_VERTICAL_OFFSET = 5;
const STACK_HEIGHT = 26;

function createFlagBall(idOffset = 0) {
  const flag = countryFlags[Math.floor(Math.random() * countryFlags.length)];
  const gradient = flagGradients[Math.floor(Math.random() * flagGradients.length)];
  const fallDuration = 1.8 + Math.random() * 0.6;

  return {
    id: Date.now() + idOffset + Math.random(),
    flag,
    gradient,
    x: Math.random() * 70 + 15,
    delay: Math.random() * 0.4,
    duration: fallDuration,
  };
}

function FallingFlag({ ball, targetY, onSettle }) {
  return (
    <motion.div
      key={ball.id}
      initial={{ y: -220, opacity: 0, scale: 0.94 }}
      animate={{ y: targetY, opacity: 1, scale: 1 }}
      transition={{ delay: ball.delay, duration: ball.duration, ease: [0.28, 0.74, 0.37, 1.02] }}
      onAnimationComplete={() => onSettle(ball)}
      className={`absolute flex -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br ${ball.gradient} text-3xl shadow-[0_24px_60px_rgba(6,18,32,0.45)]`}
      style={{ left: `${ball.x}%`, width: FLAG_SIZE, height: FLAG_SIZE }}
    >
      <span>{ball.flag}</span>
    </motion.div>
  );
}

function SettledFlag({ ball }) {
  return (
    <motion.div
      key={`settled-${ball.id}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{
        opacity: 1,
        y: [0, -12, 0], // Bouncing effect
        scale: [1, 1.1, 1], // Slight scale on bounce
      }}
      transition={{
        opacity: { duration: 0.3 },
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: ball.stackIndex * 0.1 + (ball.finalX / 100) * 0.5, // Staggered delay based on position
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: ball.stackIndex * 0.1 + (ball.finalX / 100) * 0.5,
        }
      }}
      whileHover={{
        scale: 1.2,
        y: -20,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
      className={`absolute flex -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br ${ball.gradient} text-3xl shadow-[0_16px_38px_rgba(4,13,26,0.4)] cursor-pointer`}
      style={{ left: `${ball.finalX}%`, bottom: ball.bottomOffset, width: FLAG_SIZE, height: FLAG_SIZE }}
    >
      <span>{ball.flag}</span>
    </motion.div>
  );
}

export function Testimonials() {
  const containerRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const offsets = useMemo(
    () => extendedTestimonials.map((_, index) => index - (extendedTestimonials.length - 1) / 2),
    [],
  );
  const [containerHeight, setContainerHeight] = useState(720);
  const [fallingFlags, setFallingFlags] = useState([]);
  const [settledFlags, setSettledFlags] = useState([]);
  const [totalFlags, setTotalFlags] = useState(0);
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || hasLaunched) return undefined;

    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      setHasLaunched(true);
      setFallingFlags(countryFlags.slice(0, MAX_TOTAL_FLAGS).map((_, index) => createFlagBall(index)));
      return undefined;
    }

    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasLaunched) {
        setHasLaunched(true);
        setFallingFlags(countryFlags.slice(0, MAX_TOTAL_FLAGS).map((_, index) => createFlagBall(index)));
      }
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.35 });
    observer.observe(node);

    return () => observer.disconnect();
  }, [hasLaunched]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (typeof window === 'undefined' || typeof window.ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect?.height) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserverRef.current = observer;
    observer.observe(container);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

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

    container.addEventListener('pointermove', updateTilt);
    container.addEventListener('pointerleave', resetTilt);

    return () => {
      container.removeEventListener('pointermove', updateTilt);
      container.removeEventListener('pointerleave', resetTilt);
    };
  }, []);

  const targetY = useMemo(() => Math.max(containerHeight - BASE_ZONE_HEIGHT - FLAG_SIZE, 260), [containerHeight]);

  const handleSettle = (ball) => {
    setFallingFlags((prev) => prev.filter((item) => item.id !== ball.id));
    setSettledFlags((prev) => {
      if (totalFlags >= MAX_TOTAL_FLAGS) {
        return prev;
      }

      const slotCounts = SLOT_POSITIONS.reduce((acc, slot) => {
        acc[slot] = prev.filter((item) => item.slot === slot).length;
        return acc;
      }, {});

      const bestSlot = SLOT_POSITIONS.reduce(
        (best, slot) => {
          const count = slotCounts[slot] ?? 0;
          const cost = Math.abs(slot - ball.x) + count * 6;
          if (cost < best.cost) {
            return { slot, count, cost };
          }
          return best;
        },
        { slot: SLOT_POSITIONS[0], count: slotCounts[SLOT_POSITIONS[0]] ?? 0, cost: Number.POSITIVE_INFINITY },
      );

      const stackIndex = bestSlot.count;
      const horizontalJitter = (Math.random() - 0.5) * (stackIndex > 0 ? 4 : 2);

      const next = [
        ...prev,
        {
          ...ball,
          slot: bestSlot.slot,
          finalX: Math.max(3, Math.min(97, bestSlot.slot + horizontalJitter)),
          bottomOffset: STACK_VERTICAL_OFFSET + stackIndex * STACK_HEIGHT,
          stackIndex,
        },
      ].sort((a, b) => (a.finalX === b.finalX ? a.stackIndex - b.stackIndex : a.finalX - b.finalX));

      return next;
    });
    setTotalFlags((count) => Math.min(count + 1, MAX_TOTAL_FLAGS));
  };

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
        <div className="pointer-events-none absolute inset-0">
          <AnimatePresence>
            {fallingFlags.map((ball) => (
              <FallingFlag key={ball.id} ball={ball} targetY={targetY} onSettle={handleSettle} />
            ))}
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 h-[240px] bg-gradient-to-t from-midnight/94 via-midnight/78 to-transparent">
            <div className="relative h-full w-full">
              {settledFlags.map((ball) => (
                <SettledFlag ball={ball} key={ball.id} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex justify-center text-center text-brand-200">
          <h2 className="mt-20 mb-16 font-display text-3xl sm:text-4xl">
            Customer testimonials
          </h2>
        </div>
        <ul className="relative grid gap-6 text-white sm:grid-cols-2 lg:grid-cols-4">
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
