import { highlightProducts } from '../data/products.js';
import { Button } from '../components/Button.jsx';

const spaPackages = [
  {
    name: 'Oceanstone Glow Facial',
    duration: '60 minutes',
    description: 'Marine peptide cleanse, sea-salt exfoliation, and tidal massage finished with luminous algae mask.',
  },
  {
    name: 'Shoreline Detox Ritual',
    duration: '90 minutes',
    description: 'Full-body scrub, hot-stone drift therapy, and neroli hydration wrap to reset mind and body.',
  },
  {
    name: 'Sunset Manicure Bar',
    duration: '45 minutes',
    description: 'Mineral soak, sea glass polish, and custom aromatherapy finishing spray for retail guests on-the-go.',
  },
];

export function Offerings() {
  const featuredProducts = highlightProducts.slice(0, 3);

  return (
    <section id="offerings" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="grid gap-12 lg:grid-cols-[1fr,1fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-200">Retail assortment</p>
          <h2 className="font-display text-3xl text-white">
            Signature products your clients carry home with coastal stories in hand.
          </h2>
          <p className="text-sm text-white/70">
            Our best sellers blend artisan technique with daily utility. Each SKU arrives with merchandising cards, QR-linked
            storytelling, and display fixtures.
          </p>
          <div className="space-y-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-start gap-4 rounded-3xl border border-white/10 bg-ocean/60 p-5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="font-display text-lg text-white">{product.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-brand-200">{product.category}</p>
                  <p className="mt-2 text-sm text-white/70">{product.description}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary">View full catalogue</Button>
        </div>

        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-200">Beauty spa services</p>
          <h2 className="font-display text-3xl text-white">
            Spa rituals that transform your treatment rooms into coastal sanctuaries.
          </h2>
          <p className="text-sm text-white/70">
            Blue Ocean aestheticians co-create signature menus and train your therapists with sensory choreography, curated
            playlists, and retail tie-ins.
          </p>
          <div className="space-y-4">
            {spaPackages.map((pkg) => (
              <div key={pkg.name} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg text-white">{pkg.name}</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">{pkg.duration}</span>
                </div>
                <p className="mt-3 text-sm text-white/70">{pkg.description}</p>
              </div>
            ))}
          </div>
          <Button>Book spa strategy call</Button>
        </div>
      </div>
    </section>
  );
}
