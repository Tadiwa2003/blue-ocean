import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedProductsGrid - Adds GSAP scroll-triggered animations to product/service grids
 * Features:
 * - Staggered fade-in animations for cards
 * - Parallax effects on scroll
 * - Smooth entrance animations
 * - Intersection observer for performance
 */
export function AnimatedProductsGrid({ children, className = '', staggerDelay = 0.1 }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('[data-animated-card]');
    if (cards.length === 0) return;

    // Set initial state
    gsap.set(cards, {
      opacity: 0,
      y: 60,
      scale: 0.9,
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: staggerDelay,
    });

    // Add parallax effect to container
    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: (i, target) => {
        return -gsap.getProperty(target, 'height') * 0.1;
      },
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [children, staggerDelay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * AnimatedCard - Wrapper component for individual cards
 */
export function AnimatedCard({ children, index = 0 }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Add hover animation
    const card = cardRef.current;
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        y: -8,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} data-animated-card style={{ animationDelay: `${index * 0.1}s` }}>
      {children}
    </div>
  );
}

