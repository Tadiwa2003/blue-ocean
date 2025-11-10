import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * CounterLoader - Animated counter loader with CSS grid and keyframe animations
 * Shows before dashboard loads with a smooth counting animation
 */
export function CounterLoader({ onComplete, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    // Animate counter from 0 to 100
    const targetCount = 100;
    const steps = 50;
    const increment = targetCount / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newCount = Math.min(Math.round(increment * currentStep), targetCount);
      setCount(newCount);

      if (newCount >= targetCount) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
        }, 300);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate container entrance
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
      }
    );

    // Animate counter
    if (counterRef.current) {
      gsap.fromTo(
        counterRef.current,
        {
          scale: 0.5,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 0.2,
        }
      );
    }

    // Animate grid cells
    if (gridRef.current) {
      const cells = gridRef.current.querySelectorAll('.grid-cell');
      gsap.fromTo(
        cells,
        {
          scale: 0,
          opacity: 0,
          rotation: -180,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
          stagger: {
            amount: 1.2,
            from: 'random',
          },
          delay: 0.3,
        }
      );
    }

    // Exit animation
    if (isComplete) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: 'power2.in',
      });
    }
  }, [isComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-midnight"
    >
      {/* Animated Grid Background */}
      <div
        ref={gridRef}
        className="counter-loader-grid absolute inset-0 opacity-20"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
          gap: '2px',
          padding: '20px',
        }}
      >
        {Array.from({ length: 96 }).map((_, i) => (
          <div
            key={i}
            className="grid-cell rounded-sm bg-gradient-to-br from-brand-400/30 to-brand-600/20"
            style={{
              minHeight: '20px',
            }}
          />
        ))}
      </div>

      {/* Counter Display */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <div
            ref={counterRef}
            className="text-center font-display text-8xl font-bold text-white sm:text-9xl"
            style={{
              textShadow: '0 0 40px rgba(29, 160, 230, 0.5), 0 0 80px rgba(29, 160, 230, 0.3)',
            }}
          >
            {count}%
          </div>
          <div className="absolute inset-0 animate-pulse">
            <div
              className="h-full w-full rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(29, 160, 230, 0.4) 0%, transparent 70%)',
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-brand-200 sm:text-xl">Loading Dashboard</p>
          <p className="mt-2 text-sm text-white/60">Preparing your Blue Ocean experience...</p>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-64 overflow-hidden rounded-full bg-white/10 sm:w-80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 transition-all duration-300 ease-out"
            style={{
              width: `${count}%`,
              boxShadow: '0 0 20px rgba(29, 160, 230, 0.6)',
            }}
          />
        </div>
      </div>

      {/* Logo */}
      <div className="absolute bottom-8 z-10">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span>Blue Ocean</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}

