import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button.jsx';
import { SUBSCRIPTION_TIERS } from '../config/subscriptionFeatures.js';

const tierIcons = {
    [SUBSCRIPTION_TIERS.BASIC]: Sparkles,
    [SUBSCRIPTION_TIERS.PROFESSIONAL]: Crown,
    [SUBSCRIPTION_TIERS.ENTERPRISE]: Rocket,
};

const tierColors = {
    [SUBSCRIPTION_TIERS.BASIC]: {
        gradient: 'from-brand-500 to-brand-600',
        glow: 'brand-500',
    },
    [SUBSCRIPTION_TIERS.PROFESSIONAL]: {
        gradient: 'from-purple-500 to-purple-600',
        glow: 'purple-500',
    },
    [SUBSCRIPTION_TIERS.ENTERPRISE]: {
        gradient: 'from-emerald-500 to-emerald-600',
        glow: 'emerald-500',
    },
};

export function UpgradePrompt({
    isOpen,
    onClose,
    feature,
    currentTier,
    requiredTier,
    message,
    onUpgrade,
}) {
    if (!isOpen) return null;

    const TierIcon = tierIcons[requiredTier] || Crown;
    const colors = tierColors[requiredTier] || tierColors[SUBSCRIPTION_TIERS.PROFESSIONAL];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="relative w-full max-w-md"
                        >
                            {/* Glow Effect */}
                            <div
                                className={`absolute inset-0 rounded-3xl opacity-30 blur-2xl bg-gradient-to-br ${colors.gradient}`}
                            />

                            {/* Content */}
                            <div className="relative bg-gradient-to-br from-ocean/95 to-midnight/95 rounded-3xl border border-white/10 overflow-hidden">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>

                                {/* Header with Icon */}
                                <div className="relative p-8 pb-6">
                                    {/* Background Pattern */}
                                    <div
                                        className="absolute inset-0 opacity-5"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
                                            backgroundSize: '32px 32px',
                                        }}
                                    />

                                    {/* Icon */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className={`relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-6`}
                                        style={{
                                            boxShadow: `0 8px 32px rgba(var(--${colors.glow}), 0.4)`,
                                        }}
                                    >
                                        <TierIcon className="w-10 h-10 text-white" />
                                    </motion.div>

                                    {/* Title */}
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl font-bold text-white text-center mb-2"
                                    >
                                        Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
                                    </motion.h2>

                                    {/* Message */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-white/70 text-center leading-relaxed"
                                    >
                                        {message || `This feature requires a ${requiredTier} subscription.`}
                                    </motion.p>
                                </div>

                                {/* Feature Highlight */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="px-8 pb-6"
                                >
                                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 p-2 rounded-lg bg-gradient-to-br ${colors.gradient}`}>
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold text-white mb-1">
                                                    {feature || 'Premium Feature'}
                                                </h3>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    Unlock this and many more features with {requiredTier}.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Actions */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="p-8 pt-0 space-y-3"
                                >
                                    {/* Upgrade Button */}
                                    <Button
                                        onClick={() => {
                                            onUpgrade?.(requiredTier);
                                            onClose();
                                        }}
                                        className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-semibold py-4 shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                                        style={{
                                            boxShadow: `0 8px 24px rgba(var(--${colors.glow}), 0.4)`,
                                        }}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            Upgrade Now
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    </Button>

                                    {/* Cancel Button */}
                                    <button
                                        onClick={onClose}
                                        className="w-full px-6 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                                    >
                                        Maybe Later
                                    </button>
                                </motion.div>

                                {/* Bottom Accent */}
                                <div
                                    className={`h-1 bg-gradient-to-r ${colors.gradient}`}
                                />
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default UpgradePrompt;
