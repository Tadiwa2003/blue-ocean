import { features } from '../data/products.js';
import { FeatureCard } from '../components/FeatureCard.jsx';
import { SectionTitle } from '../components/SectionTitle.jsx';

export function Features() {
  return (
    <section id="story" className="mx-auto mt-24 max-w-6xl px-6">
      <SectionTitle
        eyebrow="Why Blue Ocean"
        title="Coastal sensory experiences, crafted for elevated retail destinations."
        description="We orchestrate product, storytelling, and service so your guests feel like they are stepping onto a private shoreline—no matter the city."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}
