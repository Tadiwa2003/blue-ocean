import { Button } from '../components/Button.jsx';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { downloadRitualMenu } from '../utils/generateRitualMenu.js';
import Carousel from '../components/ui/Carousel.jsx';
import { FiShoppingBag, FiHeart, FiLayers } from 'react-icons/fi';

export function Offerings({ onBookStrategyCall, onDownloadMenu, onViewSpaStorefront }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const carouselItems = [
    {
      title: 'Merchant Store Platform',
      description: 'Sell Your Products Online with Full Control. Complete product catalog, inventory management, payment processing, and real-time analytics—all from one powerful dashboard.',
      id: 1,
      icon: <FiShoppingBag className="carousel-icon" />,
      content: {
        label: 'Merchant Store Platform',
        heading: 'Sell Your Products Online with Full Control',
        description: 'Our merchant store platform gives you everything you need to sell products online. Manage your catalog, track inventory, process payments, and analyze sales—all from one powerful dashboard.',
        features: [
          'Complete product catalog and inventory management system.',
          'Integrated payment processing and secure checkout.',
          'Order tracking, fulfillment, and customer management tools.',
          'Real-time sales analytics and performance reporting.'
        ],
        buttons: [
          { label: 'Learn more', variant: 'secondary', onClick: () => {
            const retailSection = document.getElementById('retail');
            if (retailSection) {
              retailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }},
          { label: 'View lookbook', variant: 'primary', onClick: () => {
            const retailSection = document.getElementById('retail');
            if (retailSection) {
              retailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        ]
      }
    },
    {
      title: "Tana's Ritual Exchange",
      description: 'Convert spa demand into curated, revenue-ready experiences. Mix and match rituals, define spending allowances, and prompt therapists with in-treatment suggestions.',
      id: 2,
      icon: <FiHeart className="carousel-icon" />,
      content: {
        label: "Tana's Ritual Exchange",
        heading: 'Convert spa demand into curated, revenue-ready experiences.',
        description: 'Mix and match rituals, define spending allowances, and prompt therapists with in-treatment suggestions. Guests leave with bundled keepsakes while you track conversion in real time.',
        features: [
          { label: 'Selected Ritual', value: 'Shoreline Detox 90 min' },
          { label: 'Therapist choreography pack', value: 'Included' },
          { label: 'Retail upsell pairing', value: 'Sea Glass Body Oil' },
          { label: 'Guest communications', value: 'Automated' }
        ],
        buttons: [
          { label: 'View Storefront', variant: 'primary', onClick: onViewSpaStorefront || (() => {
            const contactSection = document.getElementById('cta');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
          })},
          { label: 'Book spa strategy call', variant: 'secondary', onClick: onBookStrategyCall || (() => {
            const contactSection = document.getElementById('cta');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
          })},
          { label: 'Download ritual menu', variant: 'ghost', onClick: onDownloadMenu || downloadRitualMenu }
        ]
      }
    },
    {
      title: 'Platform Rental',
      description: 'Rent Our Platform to Other Merchants. Complete marketplace access with subscription-based pricing, full features, dedicated support, and flexible revenue sharing models.',
      id: 3,
      icon: <FiLayers className="carousel-icon" />,
      content: {
        label: 'Platform Rental',
        heading: 'Rent Our Platform to Other Merchants',
        description: 'Let other businesses sell their products and services through our marketplace. We offer subscription-based platform access with full features, dedicated support, and flexible revenue sharing models.',
        features: [
          'Complete marketplace access for other merchants',
          'Subscription-based pricing with flexible plans',
          'Full platform features and dedicated support',
          'Revenue sharing and commission options available'
        ],
        buttons: [
          { label: 'Learn more', variant: 'secondary', onClick: () => {
            const subscriptionSection = document.getElementById('intro');
            if (subscriptionSection) {
              subscriptionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }},
          { label: 'Get started', variant: 'primary', onClick: onBookStrategyCall || (() => {
            const contactSection = document.getElementById('cta');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
          })}
        ]
      }
    }
  ];

  return (
    <section ref={sectionRef} id="offerings" className="mx-auto mt-24 max-w-6xl px-6">
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">Three ways to grow with BrightPath</p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Beauty Spa, Merchant Store, and Marketplace Platform Rental</h2>
      </motion.div>
      
      <div className="flex justify-center w-full">
        <div style={{ height: '700px', position: 'relative', width: '100%', maxWidth: '500px' }}>
          <Carousel
            items={carouselItems}
            baseWidth={480}
            autoplay={true}
            autoplayDelay={5000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </div>
      </div>

      {/* Old static panels - hidden but kept for reference */}
      <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:items-start" style={{ display: 'none' }}>
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
              Merchant Store Platform
            </span>
            <h2 className="font-display text-3xl leading-tight sm:text-[2.5rem]">
              Sell Your Products Online with Full Control
          </h2>
            <p className="text-sm text-white/75">
              Our merchant store platform gives you everything you need to sell products online. Manage your catalog, track inventory, process payments, and analyze sales—all from one powerful dashboard.
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                Complete product catalog and inventory management system.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                Integrated payment processing and secure checkout.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                Order tracking, fulfillment, and customer management tools.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                Real-time sales analytics and performance reporting.
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
                  if (onViewSpaStorefront) {
                    onViewSpaStorefront();
                  } else {
                    // Fallback: scroll to contact section or open contact modal
                    const contactSection = document.getElementById('cta');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                View Storefront
              </Button>
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
                variant="secondary"
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

        <motion.article
          initial={{ x: 50, opacity: 0, scale: 0.95 }}
          animate={isInView ? { x: 0, opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5, scale: 1.01 }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-emerald-500/20 via-midnight to-emerald-700/40 p-10 text-white shadow-[0_35px_80px_rgba(4,11,24,0.45)] backdrop-blur"
        >
          <div className="absolute -right-12 top-6 h-32 w-32 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-28 w-28 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="relative space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/75">
              Platform Rental
            </span>
            <h2 className="font-display text-3xl leading-tight sm:text-[2.5rem]">
              Rent Our Platform to Other Merchants
            </h2>
            <p className="text-sm text-white/70">
              Let other businesses sell their products and services through our marketplace. We offer subscription-based platform access with full features, dedicated support, and flexible revenue sharing models.
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                Complete marketplace access for other merchants
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                Subscription-based pricing with flexible plans
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                Full platform features and dedicated support
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                Revenue sharing and commission options available
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="secondary"
                onClick={() => {
                  const subscriptionSection = document.getElementById('intro');
                  if (subscriptionSection) {
                    subscriptionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Learn more
              </Button>
              <Button 
                onClick={() => {
                  if (onBookStrategyCall) {
                    onBookStrategyCall();
                  } else {
                    const contactSection = document.getElementById('cta');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                Get started
              </Button>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
