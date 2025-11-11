import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const tiles = [
  {
    label: 'Beauty Spa',
    title: 'Tana\'s Beauty Boost Spa Services',
    description:
      'Book premium beauty and wellness treatments online. From facials and massages to complete wellness packages, we offer professional spa services with easy online booking.',
    icon: '💆',
  },
  {
    label: 'Merchant Store',
    title: 'Sell Your Products Online',
    description:
      'Manage your product catalog, track inventory, process orders, and analyze sales through our integrated merchant store platform. Everything you need to run your online business.',
    icon: '🛍️',
  },
  {
    label: 'Rent Platform',
    title: 'Let Others Sell Through Our Marketplace',
    description:
      'Rent our platform to other merchants who want to sell their goods. Subscription-based access with full features, support, and flexible revenue sharing options.',
    icon: '🏪',
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
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">Three core business models</p>
        <h2 className="font-display text-3xl text-white sm:text-4xl">Beauty Spa, Merchant Store, and Marketplace Platform Rental</h2>
        <p className="text-sm text-white/70 sm:max-w-2xl">
          Blue Ocean Marketplace powers Tana's Beauty Boost Spa for wellness services, our merchant store for product sales, and offers platform rental for other merchants to sell their goods through our marketplace.
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


