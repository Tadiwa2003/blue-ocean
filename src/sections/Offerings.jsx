import { Button } from '../components/Button.jsx';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { downloadRitualMenu } from '../utils/generateRitualMenu.js';

export function Offerings({ onBookStrategyCall, onDownloadMenu }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="offerings" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <motion.article 
          initial={{ x: -50, opacity: 0, scale: 0.95 }}
          animate={isInView ? { x: 0, opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5, scale: 1.01 }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-brand-500/20 via-midnight to-brand-700/40 p-10 text-white shadow-[0_35px_80px_rgba(4,11,24,0.45)] backdrop-blur"
        >
          <div className="absolute -right-20 top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -left-16 bottom-12 h-32 w-32 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="relative space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              Blue Ocean Capsule Kits
            </span>
            <h2 className="font-display text-3xl leading-tight sm:text-[2.5rem]">
              Contactless retail refresh? Absolutely. Inventory controls? Covered.
          </h2>
            <p className="text-sm text-white/75">
              Build coastal-luxury collections with spending limits, capsule locks, and instant restock options. Freeze a drop,
              launch a new one, or tailor assortments per property—all from one dashboard.
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                Set capsule budgets, merchandising layouts, and approval flows.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                Freeze collections in a tap and reassign inventory between boutiques.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                Pair every drop with sensory assets, QR storytelling, and logistics.
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="secondary"
                onClick={() => {
                  // Scroll to retail section to show products
                  const retailSection = document.getElementById('retail');
                  if (retailSection) {
                    retailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    // Fallback: scroll to intro section
                    const introSection = document.getElementById('intro');
                    if (introSection) {
                      introSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                }}
              >
                Learn more
              </Button>
              <Button 
                onClick={() => {
                  // View lookbook - scroll to retail section to see product showcase
                  const retailSection = document.getElementById('retail');
                  if (retailSection) {
                    retailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    // Fallback: try to find product showcase
                    const productShowcase = document.querySelector('[data-section="collections"]');
                    if (productShowcase) {
                      productShowcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                }}
              >
                View lookbook
              </Button>
            </div>
          </div>
        </motion.article>

        <motion.article
          id="spa"
          initial={{ x: 50, opacity: 0, scale: 0.95 }}
          animate={isInView ? { x: 0, opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5, scale: 1.01 }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/6 p-10 text-white shadow-[0_35px_80px_rgba(4,11,24,0.45)] backdrop-blur"
        >
          <div className="absolute -right-12 top-6 h-32 w-32 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-28 w-28 rounded-full bg-brand-300/15 blur-3xl" />
          <div className="relative space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/75">
              Tana’s Ritual Exchange
            </span>
            <h2 className="font-display text-3xl leading-tight sm:text-[2.5rem]">
              Convert spa demand into curated, revenue-ready experiences.
            </h2>
            <div className="rounded-[28px] border border-white/10 bg-white/8 p-6">
              <div className="flex items-center justify-between gap-4 text-sm font-semibold text-white/85">
                <span>Selected Ritual</span>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  👣 Shoreline Detox
                  <span className="rounded-full border border-white/20 px-2 py-1">90 min</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Therapist choreography pack</span>
                  <span className="text-white/85">Included</span>
          </div>
                <div className="flex items-center justify-between">
                  <span>Retail upsell pairing</span>
                  <span className="text-brand-200">Sea Glass Body Oil</span>
        </div>
                <div className="flex items-center justify-between">
                  <span>Guest communications</span>
                  <span className="text-white/85">Automated</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Mix and match rituals, define spending allowances, and prompt therapists with in-treatment suggestions.
              Guests leave with bundled keepsakes while you track conversion in real time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => {
                  if (onBookStrategyCall) {
                    onBookStrategyCall();
                  } else {
                    // Fallback: scroll to contact section or open contact modal
                    const contactSection = document.getElementById('cta');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                Book spa strategy call
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  if (onDownloadMenu) {
                    onDownloadMenu();
                  } else {
                    // Fallback: use utility function
                    downloadRitualMenu();
                  }
                }}
              >
                Download ritual menu
              </Button>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
