import { Button } from '../components/Button.jsx';

export function CallToAction() {
  return (
    <section id="cta" className="mx-auto mt-24 max-w-4xl px-6">
      <div className="rounded-[40px] border border-brand-400/30 bg-gradient-to-br from-ocean via-midnight to-brand-700/40 p-10 text-center shadow-glow">
        <h2 className="font-display text-3xl text-white sm:text-4xl">
          Join the Blue Ocean tide alerts
        </h2>
        <p className="mt-4 text-sm text-white/70">
          Receive first-look access to capsule reveals, ocean-forward collaborations, and sensory playlists that set the mood for your next launch.
        </p>
        <form className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="h-12 w-full max-w-sm rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none"
          />
          <Button type="submit">Join the List</Button>
        </form>
        <p className="mt-3 text-xs text-white/40">
          Monthly tides, no spam. Opt out anytime.
        </p>
      </div>
    </section>
  );
}
