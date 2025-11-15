import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Sparkles, Check, ArrowRight, Heart } from 'lucide-react';
import { Button } from './Button.jsx';
import { BeautySpaLogo } from './BeautySpaLogo.jsx';

const spaPackages = [
  {
    id: 'ultimate-bliss',
    name: 'Ultimate Bliss Package',
    price: 299,
    duration: '4 hours',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
    description: 'The ultimate luxury spa experience combining our most exclusive treatments for complete rejuvenation.',
    includes: [
      'Premium Deep Cleansing Facial (90 min)',
      'Full Body Aromatherapy Massage (90 min)',
      'Sea Stone Body Treatment (60 min)',
      'Scalp & Hair Treatment (30 min)',
      'Champagne & Light Refreshments',
      'Complimentary Product Gift Set'
    ],
    benefits: [
      'Deep relaxation and stress relief',
      'Complete skin rejuvenation',
      'Improved circulation and energy',
      'Takes 2 weeks to book'
    ],
    badge: 'Most Popular',
    popular: true
  },
  {
    id: 'serenity-retreat',
    name: 'Serenity Retreat Package',
    price: 199,
    duration: '2.5 hours',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop',
    description: 'A peaceful escape designed to calm your mind, soothe your body, and restore your inner balance.',
    includes: [
      'Gentle Facial Treatment (60 min)',
      'Swedish Massage (60 min)',
      'Hand & Foot Pampering (30 min)',
      'Herbal Tea & Light Snacks',
      'Relaxation Lounge Access'
    ],
    benefits: [
      'Perfect for first-time visitors',
      'Gentle and non-invasive',
      'Instant stress relief',
      'Available same week'
    ],
    badge: 'Perfect for Beginners',
    popular: false
  },
  {
    id: 'rejuvenation-renewal',
    name: 'Rejuvenation & Renewal',
    price: 249,
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400&fit=crop',
    description: 'Transform your skin and body with advanced anti-aging treatments and therapeutic techniques.',
    includes: [
      'Advanced Anti-Aging Facial (75 min)',
      'Deep Tissue Massage (75 min)',
      'Body Exfoliation & Hydration (45 min)',
      'Eye Treatment & Brightening (15 min)',
      'Premium Skincare Products Consultation'
    ],
    benefits: [
      'Visible anti-aging results',
      'Improved skin texture and tone',
      'Enhanced muscle recovery',
      'Professional product recommendations'
    ],
    badge: 'Best Value',
    popular: false
  },
  {
    id: 'couples-escape',
    name: 'Couples Escape Package',
    price: 549,
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
    description: 'Share the luxury experience with your partner in our private couples treatment suite.',
    includes: [
      'Side-by-Side Couples Massage (90 min)',
      'Matching Facial Treatments (60 min)',
      'Shared Relaxation Suite',
      'Champagne & Chocolates',
      'Romantic Ambiance & Music',
      'Dual Gift Sets'
    ],
    benefits: [
      'Perfect for special occasions',
      'Private treatment room',
      'Synchronized treatments',
      'Memorable shared experience'
    ],
    badge: 'Perfect for Couples',
    popular: false
  },
  {
    id: 'bridal-bloom',
    name: 'Bridal Bloom Package',
    price: 399,
    duration: 'Full Day',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
    description: 'Comprehensive pre-wedding beauty and wellness experience to ensure you glow on your special day.',
    includes: [
      'Deep Pore Cleansing Facial (90 min)',
      'Full Body Scrub & Wrap (90 min)',
      'Bridal Hair & Makeup Trial (2 hours)',
      'Manicure & Pedicure (90 min)',
      'Pre-Wedding Skincare Consultation',
      'Bridal Beauty Gift Bag'
    ],
    benefits: [
      'Complete bridal preparation',
      'Professional makeup trial',
      'Long-lasting radiance',
      'Book 1 month in advance'
    ],
    badge: 'Bridal Special',
    popular: false
  },
  {
    id: 'wellness-warrior',
    name: 'Wellness Warrior Package',
    price: 179,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop',
    description: 'A focused treatment package for the active lifestyle, combining recovery and rejuvenation.',
    includes: [
      'Sports Recovery Massage (60 min)',
      'Detoxifying Body Wrap (45 min)',
      'Hydrating Facial (30 min)',
      'Energy-Boosting Refreshments',
      'Post-Treatment Stretching Guide'
    ],
    benefits: [
      'Muscle recovery support',
      'Improved flexibility',
      'Increased energy levels',
      'Great after workouts'
    ],
    badge: 'For Active Lifestyles',
    popular: false
  }
];

export function PackagesPage({ isOpen, onClose, onBookPackage }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBookPackage = (pkg) => {
    if (onBookPackage) {
      onBookPackage(pkg);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-4 z-[101] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-ocean/90 to-midnight shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-ocean/90 to-midnight/90 backdrop-blur-xl px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <BeautySpaLogo className="h-10 w-auto" showText={false} />
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">Spa Packages</h2>
                    <p className="text-sm text-white/70">Choose your perfect wellness experience</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-8rem)] overflow-y-auto px-6 py-8">
              {!selectedPackage ? (
                // Packages Grid
                <div className="mx-auto max-w-7xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 text-center"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
                      Wellness Packages
                    </p>
                    <h3 className="mt-3 font-display text-4xl text-white">
                      Curated Spa Experiences for Every Need
                    </h3>
                    <p className="mt-4 max-w-2xl mx-auto text-base text-white/80">
                      Discover our thoughtfully designed packages that combine our signature treatments
                      for a complete wellness journey.
                    </p>
                  </motion.div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {spaPackages.map((pkg, index) => (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-all hover:border-brand-400/30 hover:shadow-xl hover:shadow-brand-500/10"
                      >
                        {pkg.popular && (
                          <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                            {pkg.badge}
                          </div>
                        )}

                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          {!pkg.popular && (
                            <div className="absolute right-4 top-4 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                              {pkg.badge}
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h4 className="text-xl font-display font-bold text-white">{pkg.name}</h4>
                              <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                                <Clock className="h-4 w-4" />
                                <span>{pkg.duration}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-brand-300">${pkg.price}</div>
                              <div className="text-xs text-white/50">per package</div>
                            </div>
                          </div>

                          <p className="mb-4 text-sm leading-relaxed text-white/70">
                            {pkg.description}
                          </p>

                          <div className="mb-4 space-y-2">
                            {pkg.includes.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-white/60">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-400" />
                                <span>{item}</span>
                              </div>
                            ))}
                            {pkg.includes.length > 3 && (
                              <div className="text-xs text-brand-300">
                                +{pkg.includes.length - 3} more treatments
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={() => setSelectedPackage(pkg)}
                              className="flex-1"
                              variant="secondary"
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => handleBookPackage(pkg)}
                              className="flex-1"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                // Package Details View
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mx-auto max-w-4xl"
                >
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="mb-6 flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    <span>Back to Packages</span>
                  </button>

                  <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] overflow-hidden">
                    <div className="relative h-64 md:h-96 overflow-hidden">
                      <img
                        src={selectedPackage.image}
                        alt={selectedPackage.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="mb-2 rounded-full bg-brand-400/20 backdrop-blur-sm inline-block px-4 py-1 text-xs font-semibold text-white">
                          {selectedPackage.badge}
                        </div>
                        <h3 className="mb-2 text-4xl font-display font-bold text-white">
                          {selectedPackage.name}
                        </h3>
                        <div className="flex items-center gap-4 text-white/80">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>{selectedPackage.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-brand-400 text-brand-400" />
                            <span>Premium Experience</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="mb-6">
                        <div className="mb-2 text-4xl font-bold text-brand-300">
                          ${selectedPackage.price}
                        </div>
                        <p className="text-lg leading-relaxed text-white/80">
                          {selectedPackage.description}
                        </p>
                      </div>

                      <div className="mb-8 grid gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                            <Sparkles className="h-5 w-5 text-brand-400" />
                            What's Included
                          </h4>
                          <ul className="space-y-3">
                            {selectedPackage.includes.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-400/20">
                                  <Check className="h-3 w-3 text-brand-400" />
                                </div>
                                <span className="text-sm leading-relaxed text-white/80">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                            <Heart className="h-5 w-5 text-brand-400" />
                            Benefits
                          </h4>
                          <ul className="space-y-3">
                            {selectedPackage.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-400/20">
                                  <Star className="h-3 w-3 text-brand-400" />
                                </div>
                                <span className="text-sm leading-relaxed text-white/80">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={() => handleBookPackage(selectedPackage)}
                          className="flex-1 text-lg py-4"
                        >
                          Book This Package
                        </Button>
                        <Button
                          onClick={() => {
                            const email = 'Tanasbeautyboost@gmail.com';
                            const subject = encodeURIComponent(`Inquiry: ${selectedPackage.name}`);
                            const body = encodeURIComponent(`Hello, I'm interested in the ${selectedPackage.name} package. Please provide more information.`);
                            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                          }}
                          variant="secondary"
                          className="flex-1 text-lg py-4"
                        >
                          Contact Us
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

