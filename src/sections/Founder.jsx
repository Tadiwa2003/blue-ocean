import { Button } from '../components/Button.jsx';

const founderImage = '/assets/images/founder.jpeg';
const founderFallback =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80';

export function Founder() {
  return (
    <section id="founder" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="grid gap-10 rounded-[36px] border border-white/10 bg-ocean/70 px-8 py-12 text-white lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10">
          <img
            src={founderImage}
            alt="Kim Moyo founder portrait"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = founderFallback;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
        </div>
        <div className="space-y-5">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-200">Founder insight</span>
          <h2 className="font-display text-3xl">Kim Moyo · Founder & Creative Director</h2>
          <p className="text-sm text-white/70">
            Raised along the Mozambican shoreline, Kim launched Blue Ocean to bridge artisan excellence with modern retail.
            She leads a collective of merchandisers, scent designers, and logistics partners that translate ocean energy into
            retail theatre.
          </p>
          <p className="text-sm text-white/70">
            Kim oversees every capsule—from maker sourcing and pricing to soundscapes and tactile packaging—ensuring every
            launch builds relationships that last beyond the tide.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Read Kim’s journal</Button>
            <Button>Book a strategy session</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
