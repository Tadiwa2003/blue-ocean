import { SectionTitle } from '../components/SectionTitle.jsx';

const stats = [
  { label: 'Boutiques Merchandised', value: '320+' },
  { label: 'Spa Venues Activated', value: '185' },
  { label: 'SKUs Across Drops', value: '480' },
  { label: 'Average Sell-Through', value: '87%' },
];

export function Intro() {
  return (
    <section id="intro" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="grid gap-12 lg:grid-cols-[0.6fr,1fr] lg:items-center">
        <SectionTitle
          eyebrow="One platform, two experiences"
          title="Blue Ocean stocks the shelves while Tana’s Beauty Boost Spa fills the treatment rooms."
          description="Merchandise your boutique with coastal-luxury capsules and pair them with restorative spa itineraries. We supply the assets, scripts, and operations so retail and wellness launch in sync."
        />
        <div className="rounded-[32px] border border-brand-500/30 bg-ocean/40 p-8 backdrop-blur">
          <p className="text-sm text-white/70">
            Introduce guests to the world of Blue Ocean and Tana’s Beauty Boost Spa with immersive assets, ready-to-style
            merchandising kits, and ritual training that make every touchpoint feel coastal, curated, and profitable.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-6 text-white">
            {stats.map((stat) => (
              <li key={stat.label} className="space-y-1">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid gap-4 text-sm text-white/80 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-white/90 font-medium">Blue Ocean for retail leaders</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Curate coastal-luxury capsules with done-for-you lookbooks and copy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Synchronise merchandising, packaging, and launch storytelling.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Preview the storefront layout before you publish a single SKU.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Analyse performance with day, week, and month revenue dashboards.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-white/90 font-medium">Tana’s Beauty Boost Spa for wellness teams</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Launch spa itineraries with therapist scripts and sensory styling guides.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Offer upsell-friendly add-ons, pricing, and booking flows out of the box.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Coordinate guest communications, reminders, and follow-up rituals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Blend retail and spa storytelling so guests leave with keepsakes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
