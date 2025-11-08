import { SectionTitle } from '../components/SectionTitle.jsx';

const stats = [
  { label: 'Partner Boutiques', value: '320+' },
  { label: 'SKUs in Capsule Drops', value: '480' },
  { label: 'Fulfillment Accuracy', value: '99.4%' },
  { label: 'Average Sell-Through', value: '87%' },
];

export function Intro() {
  return (
    <section id="intro" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="grid gap-12 lg:grid-cols-[0.6fr,1fr] lg:items-center">
        <SectionTitle
          eyebrow="Blue Ocean Platform"
          title="From shoreline inspiration to sell-through results, every touchpoint is orchestrated."
          description="Blue Ocean empowers retailers to curate, launch, and optimise coastal-luxury capsules with editorial storytelling, logistics, and analytics built in."
        />
        <div className="rounded-[32px] border border-brand-500/30 bg-ocean/40 p-8 backdrop-blur">
          <p className="text-sm text-white/70">
            Introduce guests to the world of Blue Ocean with immersive assets, ready-to-style merchandising kits, and performance dashboards tuned for decisive retail teams.
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
              <p className="text-white/90 font-medium">What you can do with Blue Ocean</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Curate and sell coastal-luxury products with storytelling assets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Offer signature beauty spa services alongside retail experiences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Preview your storefront and merchandising before going live</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Track sales and profit analytics by day, week and month</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-white/90 font-medium">Why partners choose us</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Editorial-grade visuals and copy to accelerate sell-through</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Operational clarity from inventory to fulfillment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Owner-only product publishing for quality control</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Modern, fast storefront experiences powered by Blue Ocean</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
