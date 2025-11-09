import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, CreditCard, DollarSign, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button as PrimaryButton } from '../components/Button.jsx';
import { Button as UIShadButton } from '../components/ui/button.jsx';

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, Amex',
    color: 'from-sky-500/90 to-sky-600/90',
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: Wallet,
    description: 'PayPal, Apple Pay, Google Pay',
    color: 'from-purple-500/90 to-purple-600/90',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Direct settlement to banking partners',
    color: 'from-emerald-500/90 to-emerald-600/90',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: DollarSign,
    description: 'Bitcoin, Ethereum, USDC',
    color: 'from-amber-500/90 to-amber-600/90',
  },
];

const countryFlags = ['🇿🇼', '🇺🇸', '🇬🇧', '🇯🇵', '🇩🇪', '🇫🇷', '🇨🇦', '🇦🇺', '🇧🇷', '🇮🇳', '🇨🇳', '🇰🇷', '🇮🇹'];

const countryColors = [
  'from-sky-500/90 to-sky-600/90',
  'from-rose-500/90 to-rose-600/90',
  'from-indigo-500/90 to-indigo-600/90',
  'from-amber-500/90 to-amber-600/90',
  'from-emerald-500/90 to-emerald-600/90',
  'from-purple-500/90 to-purple-600/90',
  'from-cyan-500/90 to-cyan-600/90',
  'from-lime-500/90 to-lime-600/90',
];

const BASE_ZONE_HEIGHT = 180;
const BALL_SIZE = 68;

function createBall(idOffset = 0) {
  const flag = countryFlags[Math.floor(Math.random() * countryFlags.length)];
  const color = countryColors[Math.floor(Math.random() * countryColors.length)];
  return {
    id: Date.now() + idOffset + Math.random(),
    flag,
    color,
    x: Math.random() * 70 + 15,
    delay: Math.random() * 1.5,
  };
}

function FallingBall({ ball, targetY, onSettle }) {
  return (
    <motion.div
      key={ball.id}
      initial={{ y: -120, scale: 0.85, opacity: 0 }}
      animate={{ y: targetY, scale: 1, opacity: 1 }}
      transition={{
        delay: ball.delay,
        duration: 5 + Math.random() * 1.5,
        ease: [0.18, 0.67, 0.6, 1.02],
      }}
      onAnimationComplete={() => onSettle(ball)}
      className={`absolute flex -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br ${ball.color} text-3xl shadow-[0_20px_50px_rgba(8,17,32,0.4)]`}
      style={{ left: `${ball.x}%`, height: BALL_SIZE, width: BALL_SIZE }}
    >
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, ease: 'linear' }}
      >
        {ball.flag}
      </motion.span>
    </motion.div>
  );
}

function SettledBall({ ball, index }) {
  const drift = (index % 2 === 0 ? 1 : -1) * (Math.random() * 12 + 4);
  return (
    <motion.div
      key={`settled-${ball.id}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        y: [-6, 4, 0],
        x: [0, drift, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`absolute flex -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br ${ball.color} text-3xl shadow-[0_12px_30px_rgba(4,12,25,0.35)]`}
      style={{ left: `${ball.finalX}%`, bottom: ball.bottomOffset, height: BALL_SIZE, width: BALL_SIZE }}
    >
      <span>{ball.flag}</span>
    </motion.div>
  );
}

export function CountryPaymentShowcase() {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(640);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [fallingBalls, setFallingBalls] = useState(() => Array.from({ length: 8 }, (_, index) => createBall(index)));
  const [settledBalls, setSettledBalls] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    if (typeof window === 'undefined' || typeof window.ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect?.height) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFallingBalls((prev) => {
        if (prev.length > 6) return prev;
        return [...prev, createBall(prev.length + settledBalls.length)];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [settledBalls.length]);

  const targetY = useMemo(() => Math.max(containerHeight - BASE_ZONE_HEIGHT - BALL_SIZE, 280), [containerHeight]);

  const handleSettle = (ball) => {
    setFallingBalls((prev) => prev.filter((item) => item.id !== ball.id));
    setSettledBalls((prev) => {
      const next = [
        ...prev,
        {
          ...ball,
          finalX: Math.max(12, Math.min(88, ball.x + (Math.random() - 0.5) * 18)),
          bottomOffset: Math.random() * 32 + 12,
        },
      ].slice(-18);
      return next;
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-midnight/95 via-ocean/85 to-midnight/90 p-8 text-white shadow-[0_40px_120px_rgba(4,17,38,0.65)]"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(6,182,212,0.16),_transparent_60%)]" />
        <AnimatePresence>
          {fallingBalls.map((ball) => (
            <FallingBall key={ball.id} ball={ball} targetY={targetY} onSettle={handleSettle} />
          ))}
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-t from-midnight/90 via-midnight/70 to-transparent">
          <div className="relative h-full w-full">
            {settledBalls.map((ball, index) => (
              <SettledBall ball={ball} index={index} key={ball.id} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-10">
        <div className="space-y-3">
          <Badge className="bg-white/10 text-white/80" variant="secondary">
            Global settlements
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl">Realtime payments across every region.</h2>
          <p className="max-w-3xl text-base text-white/75">
            Watch funding currencies drop into your payout pool and decide how you want to settle: cards, digital wallets, bank
            rails, or crypto treasury. Your finance team keeps the rhythm—our platform orchestrates the moves.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton className="shadow-[0_18px_40px_rgba(13,110,200,0.4)]">Launch settlement flow</PrimaryButton>
            <UIShadButton variant="ghost" size="sm">
              View compliance docs
            </UIShadButton>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_minmax(0,0.9fr)] lg:items-start">
          <Card className="relative overflow-hidden border-white/15 bg-white/5 p-0">
            <CardHeader className="flex flex-col gap-2 px-6 pt-6">
              <CardTitle className="text-2xl">Select payment method</CardTitle>
              <CardDescription>
                Choose how you want to clear transactions. Each rail offers optimised FX, fraud checks, and treasury
                automation.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-4 md:grid-cols-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;
                  return (
                    <motion.button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition ${
                        isSelected ? 'border-brand-400/80 shadow-[0_20px_50px_rgba(13,110,200,0.35)]' : 'hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`rounded-xl bg-gradient-to-br ${method.color} p-3 text-midnight shadow-lg`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{method.name}</p>
                          <p className="text-sm text-white/70">{method.description}</p>
                        </div>
                      </div>
                      <motion.span
                        layout
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left rounded-full bg-gradient-to-r from-brand-400 to-cyan-400"
                        animate={{ scaleX: isSelected ? 1 : 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                      />
                    </motion.button>
                  );
                })}
              </div>
              {selectedPayment ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Selected payment</p>
                    <p className="text-sm font-semibold text-white">
                      {paymentMethods.find((method) => method.id === selectedPayment)?.name}
                    </p>
                  </div>
                  <UIShadButton size="sm" variant="secondary" className="border-white/15 bg-white/10 text-white">
                    Continue
                  </UIShadButton>
                </motion.div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-white/15 bg-white/5">
              <CardHeader className="px-0">
                <CardTitle className="text-lg">Global coverage snapshot</CardTitle>
                <CardDescription>Country liquidity staged and ready to settle at today&apos;s FX.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-white/75">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="flex items-center gap-2 text-white">
                    <span className="text-xl">🌍</span>
                    Settlement regions live
                  </span>
                  <span className="font-semibold text-white">{Math.max(12, settledBalls.length)}+</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="flex items-center gap-2 text-white">
                    <span className="text-xl">🔄</span>
                    Treasury automations running
                  </span>
                  <span className="font-semibold text-white">8</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="flex items-center gap-2 text-white">
                    <span className="text-xl">⚡</span>
                    Avg. settlement speed
                  </span>
                  <span className="font-semibold text-emerald-300">&lt; 6 mins</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between px-0">
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">Updated live</span>
                <Badge className="bg-brand-500/20 text-brand-100" variant="default">
                  Instant FX routing
                </Badge>
              </CardFooter>
            </Card>
            <Card className="border-dashed border-white/20 bg-transparent text-white/75">
              <p className="text-sm">
                Need to plug this into your finance stack? Use our settlements API to orchestrate cross-border payouts while the
                visualiser keeps your operations team informed.
              </p>
              <PrimaryButton variant="secondary" className="mt-4 border-white/20 bg-white/10 text-white">
                View API reference
              </PrimaryButton>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
