import * as React from 'react';

import { AmazingCard, FashionCardDemo } from './amazing-card';

export function SingleCardDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-[280px]">
        <AmazingCard
          image="https://images.unsplash.com/photo-1545911825-6bfa5b0c34a9?auto=format&fit=crop&w=774&q=80"
          title="Premium Wool Sweater"
          description="Soft and warm premium wool sweater for the coldest winter days."
          price="$129.99"
          badge="limited"
          badgeColor="limited"
        />
      </div>
    </div>
  );
}

export function AspectRatioDemo() {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
      <AmazingCard
        image="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=774&q=80"
        title="Men's Blazer"
        price="$199.99"
        aspect="portrait"
      />

      <AmazingCard
        image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1036&q=80"
        title="Designer Sunglasses"
        price="$89.99"
        aspect="square"
      />

      <AmazingCard
        image="https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=1470&q=80"
        title="Watch Collection"
        price="$299.99"
        aspect="landscape"
      />
    </div>
  );
}

export { SingleCardDemo, AspectRatioDemo, FashionCardDemo };

const Index = () => {
  return (
    <div className="min-h-screen">
      <AspectRatioDemo />
    </div>
  );
};

export default Index;

