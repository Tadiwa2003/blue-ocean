export function FeatureCard({ feature }) {
  return (
    <div className="group flex flex-col gap-4 rounded-3xl border border-white/5 bg-ocean/50 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-brand-400/60">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-2xl">
        <span aria-hidden="true">{feature.icon}</span>
      </div>
      <h3 className="font-display text-xl text-white">{feature.title}</h3>
      <p className="text-sm text-white/70 leading-relaxed">{feature.description}</p>
    </div>
  );
}
