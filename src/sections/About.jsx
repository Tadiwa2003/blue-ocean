import { SectionTitle } from '../components/SectionTitle.jsx';

const pillars = [
  {
    title: 'Retail Capsules',
    description:
      'We merchandise coastal-luxury totes, footwear, accessories, and skincare ready for shelves, e-commerce, and gifting moments.',
  },
  {
    title: 'Beauty Spa Rituals',
    description:
      'Our aestheticians design signature facials, body treatments, and scent ceremonies using Blue Ocean botanicals and soundscapes.',
  },
  {
    title: 'White-Glove Fulfilment',
    description:
      'Temperature-aware logistics, eco packaging, and concierge support deliver premium experiences to your customers worldwide.',
  },
];

export function About() {
  return (
    <section id="about" className="mx-auto mt-24 max-w-6xl px-6">
      <SectionTitle
        eyebrow="What we do"
        title="Blue Ocean sells high-conversion retail capsules and beauty spa services inspired by the shoreline."
        description="From stocked product assortments to on-site ritual menus, we help boutiques, spas, and hospitality groups launch offerings that guests crave."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-3xl border border-white/10 bg-ocean/60 p-6 text-white">
            <h3 className="font-display text-xl">{pillar.title}</h3>
            <p className="mt-3 text-sm text-white/70">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
