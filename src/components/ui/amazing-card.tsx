'use client';

import * as React from 'react';

import { cn } from '../../lib/utils.js';

export interface FashionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  title: string;
  description?: string;
  price: string;
  badge?: string;
  badgeColor?: 'sale' | 'new' | 'exclusive' | 'limited';
  aspect?: 'portrait' | 'landscape' | 'square';
  glowEffect?: boolean;
}

export function AmazingCard({
  image,
  title,
  description,
  price,
  badge,
  badgeColor = 'new',
  aspect = 'portrait',
  glowEffect = true,
  className,
  ...props
}: FashionCardProps) {
  const [rotation, setRotation] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotationX = (y - centerY) / 20;
      const rotationY = -(x - centerX) / 20;

      setRotation({ x: rotationX, y: rotationY });
    }
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const badgeStyles: Record<NonNullable<FashionCardProps['badgeColor']>, string> = {
    sale: 'bg-fashion-accent text-white',
    new: 'bg-fashion-highlight text-fashion-charcoal',
    exclusive: 'bg-fashion-charcoal text-fashion-cream',
    limited: 'bg-gradient-to-r from-fashion-accent to-fashion-highlight text-white',
  };

  const aspectClasses: Record<NonNullable<FashionCardProps['aspect']>, string> = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  };

  return (
    <div className={cn('fashion-card-container group', className)} {...props}>
      <div
        ref={cardRef}
        className={cn(
          'fashion-card relative overflow-hidden rounded-xl',
          glowEffect && 'animate-glow-pulse',
          'transition-all duration-300',
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="fashion-card-glass absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="fashion-card-content relative z-20 flex flex-col overflow-hidden rounded-xl">
          <div className={cn('parallax-image-container w-full', aspectClasses[aspect])}>
            <img src={image} alt={title} className="parallax-image h-full w-full object-cover" />
          </div>

          <div className="fashion-card-body flex flex-grow flex-col space-y-2 bg-white p-5 transition-all duration-300 group-hover:bg-opacity-80 dark:bg-gray-900 dark:group-hover:bg-opacity-90">
            <h3 className="gradient-text animate-fadeIn font-serif text-lg font-medium leading-none tracking-tight md:text-xl">
              {title}
            </h3>

            {description && (
              <p className="font-sans text-sm text-muted-foreground line-clamp-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                {description}
              </p>
            )}

            <div className="mt-auto flex items-center justify-between pt-3 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <p className="font-serif text-lg font-semibold md:text-xl">{price}</p>

              <button className="shine-effect relative overflow-hidden rounded-full px-4 py-1.5 text-xs font-medium text-white transition duration-300 hover:scale-105 hover:animate-shine">
                Shop now
              </button>
            </div>
          </div>
        </div>

        {badge && (
          <div
            className={cn(
              'fashion-card-badge animate-float px-2.5 py-1 text-xs font-medium capitalize',
              badgeStyles[badgeColor],
            )}
          >
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

export function FashionCardDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fashion-cream to-fashion-beige p-8">
      <h2 className="mb-8 text-center font-serif text-3xl font-bold text-fashion-charcoal md:text-4xl">New Arrivals</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AmazingCard
          image="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=774&q=80"
          title="Cashmere Blend Coat"
          description="Luxurious camel coat crafted from premium cashmere blend for ultimate warmth and style."
          price="$349.99"
          badge="new"
          badgeColor="new"
        />

        <AmazingCard
          image="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1470&q=80"
          title="Designer Handbag"
          description="Elegant structured handbag with gold hardware and adjustable strap."
          price="$189.99"
          badge="sale"
          badgeColor="sale"
          aspect="square"
        />

        <AmazingCard
          image="https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1374&q=80"
          title="Leather Chelsea Boots"
          description="Classic Chelsea boots crafted from genuine leather with durable rubber sole."
          price="$129.99"
          badge="exclusive"
          badgeColor="exclusive"
        />
      </div>
    </div>
  );
}

export { AmazingCard as FashionCard };

