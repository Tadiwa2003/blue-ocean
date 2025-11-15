import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const pillars = [
  {
    number: '01',
    title: 'Account',
    description: 'Align your retail and spa teams with a single dashboard that shares inventory, schedules, and brand assets.',
  },
  {
    number: '02',
    title: 'Curate',
    description: 'Select capsules and treatments tailored to your property—complete with sensory storytelling and pricing guidance.',
  },
  {
    number: '03',
    title: 'Activate',
    description: 'Invite staff, sync calendars, and launch guest communications with automated confirmations and reminders.',
  },
  {
    number: '04',
    title: 'Delight',
    description: 'Deliver immersive on-site rituals and let guests take home what they loved with bundled retail suggestions.',
  },
  {
    number: '05',
    title: 'Review',
    description: 'Track sell-through, guest sentiment, and team performance in one analytics view—iterate in a single click.',
  },
];

export function ValueJourney() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="journey" className="mx-auto mt-24 max-w-6xl px-6">
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="rounded-[40px] border border-white/10 bg-white/5 p-8 shadow-[0_28px_70px_rgba(4,11,24,0.4)] backdrop-blur"
      >
        <div className="flex flex-col gap-6 text-center sm:text-left sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">Simple · Fast · Guided</p>
            <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl md:text-[2.5rem] leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Every launch follows the same tide.
            </h2>
          </div>
          <p className="text-sm text-white/80 sm:max-w-md leading-relaxed flex-shrink-0">
            Whether you&apos;re stocking a pop-up boutique or opening a spa wing, BrightPath and Tana&apos;s Beauty Boost Spa
            keep the process five steps end-to-end.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={isInView ? { y: 0, opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-6 text-left text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 hover:border-brand-400/40 hover:bg-white/8 hover:shadow-[0_12px_32px_rgba(27,152,224,0.2)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
                {pillar.number}
              </span>
              <h3 className="text-xl font-display font-semibold text-white">{pillar.title}</h3>
              <p className="text-sm text-white/75 leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
