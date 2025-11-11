import { SectionTitle } from '../components/SectionTitle.jsx';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const stats = [
  { label: 'Boutiques Merchandised', value: '320+' },
  { label: 'Spa Venues Activated', value: '185' },
  { label: 'SKUs Across Drops', value: '480' },
  { label: 'Average Sell-Through', value: '87%' },
];

export function Intro() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="intro" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="grid gap-12 lg:grid-cols-[0.6fr,1fr] lg:items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            eyebrow="Three ways to grow with Blue Ocean"
            title="Tana's Beauty Boost Spa, Merchant Store, and Marketplace Rental Platform"
            description="We operate Tana's Beauty Boost Spa for premium wellness services, run our own merchant store for product sales, and offer our platform as a rental service for other merchants to sell their goods through our marketplace."
          />
        </motion.div>
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-[32px] border border-brand-500/30 bg-ocean/40 p-8 backdrop-blur"
        >
          <p className="text-sm text-white/70">
            Blue Ocean Marketplace is a comprehensive platform that powers three key business models: our own beauty spa services, our product merchant store, and a rental marketplace where other businesses can leverage our platform to sell their products and services.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-6 text-white">
            {stats.map((stat, index) => (
              <motion.li 
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="space-y-1"
              >
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
              </motion.li>
            ))}
          </ul>
          <div className="mt-10 grid gap-4 text-sm text-white/80 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-white/90 font-medium">Tana's Beauty Boost Spa</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Premium beauty and wellness services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Online booking and appointment management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Professional treatments and packages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                  <span>Gift cards and membership options</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-white/90 font-medium">Merchant Store</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Product catalog and inventory management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Integrated payment processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Order tracking and fulfillment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>Sales analytics and reporting</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-white/90 font-medium">Rent Our Platform</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Let other merchants sell through our marketplace</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Subscription-based platform access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Full platform features and support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Revenue sharing and commission options</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
