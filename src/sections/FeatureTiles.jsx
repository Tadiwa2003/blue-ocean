import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const tiles = [
  {
    label: 'Curate',
    title: 'Add capsule inventory in minutes.',
    description:
      'Choose from ready-to-launch product drops with merchandising copy, photography, and packaging already aligned to your resort or boutique aesthetic.',
    icon: '🧺',
  },
  {
    label: 'Activate',
    title: 'Send spa itineraries to every suite.',
    description:
      'Schedule treatments, automate confirmations, and give therapists choreography, scent notes, and upsell prompts for each guest journey.',
    icon: '💆',
  },
  {
    label: 'Delight',
    title: 'Exchange stories across retail & spa.',
    description:
      'Blend take-home rituals with on-site experiences. Guests leave with products they already love and memories tied to your brand.',
    icon: '🌊',
  },
];

export function FeatureTiles() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="features" className="mx-auto mt-24 max-w-6xl px-6">
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="space-y-4 text-center sm:text-left"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">Unify your guest journey</p>
        <h2 className="font-display text-3xl text-white sm:text-4xl">One platform connects retail capsules and spa rituals.</h2>
        <p className="text-sm text-white/70 sm:max-w-2xl">
          Operate with a single playbook—from curated inventory to treatment menus—so your team focuses on storytelling,
          not stitching together tools.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiles.map((tile, index) => (
          <motion.article
            key={tile.label}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={isInView ? { y: 0, opacity: 1, scale: 1 } : {}}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.15,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_45px_rgba(4,11,24,0.35)] transition hover:border-brand-400/40 hover:shadow-[0_32px_60px_rgba(29,160,230,0.25)] backdrop-blur"
          >
            <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-brand-500/10 blur-2xl transition group-hover:scale-125" />
            <div className="relative space-y-4">
              <motion.span 
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-2xl"
              >
                {tile.icon}
              </motion.span>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">{tile.label}</p>
              <h3 className="font-display text-xl text-white">{tile.title}</h3>
              <p className="text-sm text-white/70">{tile.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}


