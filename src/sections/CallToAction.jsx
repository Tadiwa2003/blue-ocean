import { Button } from '../components/Button.jsx';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function CallToAction() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="cta" className="mx-auto mt-24 max-w-5xl px-6">
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={isInView ? { y: 0, opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="rounded-[48px] border border-white/12 bg-gradient-to-br from-brand-500/20 via-midnight/90 to-ocean/95 p-12 text-center shadow-[0_40px_90px_rgba(4,11,24,0.45)] backdrop-blur"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">All-in-one platform</p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-[2.75rem]">
          All your retail + spa operations. One login.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70">
          Join 1,000+ boutiques, resorts, and spa teams who orchestrate product drops and treatment journeys through a single,
          secure account. You can be live in minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button>Get started</Button>
          <Button variant="secondary">Talk to our team</Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <span className="text-xl"></span>
            <span>
              Download on <br />
              App Store
            </span>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <span className="text-lg">▶</span>
            <span>
              Get it on <br />
              Ocean Play
            </span>
          </a>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40"
        >
          No setup fees · Concierge onboarding · 24/7 coastal support
        </motion.p>
      </motion.div>
    </section>
  );
}
