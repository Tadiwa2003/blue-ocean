'use client';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// Smooth scroll hook
export function useSmoothScroll(options = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: options.duration || 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef.current;
}

// Container scroll animation context
const ContainerScrollAnimationContext = React.createContext(undefined);

export function useContainerScrollAnimationContext() {
  const context = React.useContext(ContainerScrollAnimationContext);
  if (!context) {
    throw new Error(
      'useContainerScrollAnimationContext must be used within a ContainerScrollAnimation',
    );
  }
  return context;
}

// Container scroll animation wrapper
export function ContainerScrollAnimation({
  spacerClass,
  className,
  children,
  ...props
}) {
  const scrollRef = useRef(null);
  useSmoothScroll();
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  });

  return (
    <ContainerScrollAnimationContext.Provider value={{ scrollYProgress }}>
      <div ref={scrollRef} className={cn('relative', className)} {...props}>
        {children}
        <div className={cn('w-full h-96', spacerClass)} />
      </div>
    </ContainerScrollAnimationContext.Provider>
  );
}

// Scroll translate component
export function ContainerScrollTranslate({
  yRange = [0, -100],
  inputRange = [0, 1],
  style,
  className,
  ...props
}) {
  const { scrollYProgress } = useContainerScrollAnimationContext();
  const y = useTransform(scrollYProgress, inputRange, yRange);
  return (
    <motion.div
      style={{ y, ...style }}
      className={cn('relative', className)}
      {...props}
    />
  );
}

// Scroll scale component
export function ContainerScrollScale({
  scaleRange = [1.2, 1],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollYProgress } = useContainerScrollAnimationContext();
  const scale = useTransform(scrollYProgress, inputRange, scaleRange);
  return (
    <motion.div className={className} style={{ scale, ...style }} {...props} />
  );
}

// Scroll fade component
export function ContainerScrollFade({
  opacityRange = [0, 1],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollYProgress } = useContainerScrollAnimationContext();
  const opacity = useTransform(scrollYProgress, inputRange, opacityRange);
  return (
    <motion.div className={className} style={{ opacity, ...style }} {...props} />
  );
}

// Scroll inset X component
export function ContainerScrollInsetX({
  insetRange = [48, 0],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollYProgress } = useContainerScrollAnimationContext();
  const xInset = useTransform(scrollYProgress, inputRange, insetRange);
  const clipPath = useMotionTemplate`inset(0px ${xInset}px)`;
  return (
    <motion.div
      className={className}
      style={{ clipPath, ...style }}
      {...props}
    />
  );
}

