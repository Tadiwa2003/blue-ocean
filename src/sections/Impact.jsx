const impactStats = [
  { label: 'Artisan partners funded', value: '60+', description: 'Across five coastal regions in Africa' },
  { label: 'Experiential launches', value: '140', description: 'Boutiques, resorts, and pop-ups activated' },
  { label: 'Guest delight rating', value: '4.9/5', description: 'Average rating from hospitality rollouts' },
];

const stories = [
  {
    title: 'Sustainable sourcing',
    copy: 'We reinvest a percentage of every capsule into reef-safe harvesting, shoreline cleanups, and craft apprenticeships.',
  },
  {
    title: 'Retail uplift',
    copy: 'Partners see an average 28% uplift in basket value during BrightPath drops thanks to layered storytelling and sensory cues.',
  },
  {
    title: 'Community glow',
    copy: 'Our Shoreline Fellowship mentors emerging makers, giving them access to marketing assets, finance tools, and global buyers.',
  },
];

export function Impact() {
  return (
    <section id="impact" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="rounded-[36px] border border-white/10 bg-ocean/70 px-8 py-12 text-white shadow-glow">
        <div className="grid gap-10 lg:grid-cols-[0.6fr,1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-200">Impact</p>
            <h2 className="mt-3 font-display text-3xl">
              BrightPath empowers coastal makers and elevates the retail experiences they inspire.
            </h2>
            <p className="mt-4 text-sm text-white/70">
              Every partnership we accept is measured by its community impact and guest delight. From artisan collectives in
              Harare to scent studios in Cape Town, we invest in thoughtful growth and regenerative supply chains.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {impactStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-6 text-center">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                <p className="mt-2 text-xs text-white/60">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stories.map((story) => (
            <div key={story.title} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-6">
              <h3 className="font-display text-lg text-white">{story.title}</h3>
              <p className="mt-3 text-sm text-white/70">{story.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
