import { Button } from '../components/Button.jsx';
import { SectionTitle } from '../components/SectionTitle.jsx';

const tiers = [
  {
    name: 'Boutique Atelier',
    description: 'Ideal for concept stores, floral studios, and gallery retail.',
    perks: ['Seasonal capsule sets', 'In-store scent ceremony kit', 'Co-branded packaging'],
  },
  {
    name: 'Resort & Spa',
    description: 'Crafted for suites, spa programs, and poolside retail moments.',
    perks: ['Amenity design workshops', 'Temperature-aware shipping', 'Guest gifting menus'],
  },
  {
    name: 'Corporate Experience',
    description: 'Elevated gifting for executive retreats and client immersions.',
    perks: ['White-label storytelling', 'Handwritten note concierge', 'Global logistics team'],
  },
];

export function Wholesale() {
  return (
    <section id="wholesale" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="grid gap-12 rounded-[36px] border border-white/10 bg-white/[0.02] p-10 backdrop-blur-xl lg:grid-cols-[0.6fr,1fr]">
        <SectionTitle
          eyebrow="Wholesale & Partnerships"
          title="Expand your assortment with tides of sensory luxury tailored to your audience."
          description="Select a partnership tier and collaborate with our oceanic design team to script the perfect coastal narrative for your guests."
        />
        <div className="grid gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-3xl border border-white/5 bg-ocean/60 px-6 py-5 transition hover:border-brand-400/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-white">{tier.name}</h3>
                <Button variant="ghost" className="text-xs uppercase tracking-[0.3em]">
                  View Details
                </Button>
              </div>
              <p className="mt-3 text-sm text-white/70">{tier.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                {tier.perks.map((perk) => (
                  <li key={perk} className="rounded-full border border-white/10 px-3 py-1">
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-brand-400/30 bg-brand-500/10 px-6 py-6 text-sm text-white/80">
            <div>
              <p className="font-semibold uppercase tracking-[0.3em] text-brand-200">Launch with us</p>
              <p className="mt-1 text-base text-white">
                Co-create a limited tide drop for your next activation.
              </p>
            </div>
            <Button>Book Discovery Call</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
