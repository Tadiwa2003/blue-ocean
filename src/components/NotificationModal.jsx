import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function NotificationModal({
    isOpen,
    onClose,
    type = 'success', // 'success', 'error', 'info', 'warning'
    title,
    message,
    autoClose = true,
    autoCloseDuration = 3000
}) {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDuration, onClose]);

    // Note: NotificationModal doesn't prevent body scroll since it's a toast notification
    // that appears at the top and shouldn't block page interaction

    if (!isOpen) return null;

    const configs = {
        success: {
            icon: CheckCircle,
            iconColor: 'text-emerald-400',
            bgGradient: 'from-emerald-500/30 to-emerald-600/20',
            borderColor: 'border-emerald-500/40',
            glowColor: 'bg-emerald-500/20',
            ringColor: 'bg-emerald-500/20',
            titleColor: 'text-emerald-300',
            messageColor: 'text-emerald-200/80',
            progressBar: 'bg-emerald-500',
        },
        error: {
            icon: AlertCircle,
            iconColor: 'text-red-400',
            bgGradient: 'from-red-500/30 to-red-600/20',
            borderColor: 'border-red-500/40',
            glowColor: 'bg-red-500/20',
            ringColor: 'bg-red-500/20',
            titleColor: 'text-red-300',
            messageColor: 'text-red-200/80',
            progressBar: 'bg-red-500',
        },
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-amber-400',
            bgGradient: 'from-amber-500/30 to-amber-600/20',
            borderColor: 'border-amber-500/40',
            glowColor: 'bg-amber-500/20',
            ringColor: 'bg-amber-500/20',
            titleColor: 'text-amber-300',
            messageColor: 'text-amber-200/80',
            progressBar: 'bg-amber-500',
        },
        info: {
            icon: Info,
            iconColor: 'text-brand-400',
            bgGradient: 'from-brand-500/30 to-brand-600/20',
            borderColor: 'border-brand-500/40',
            glowColor: 'bg-brand-500/20',
            ringColor: 'bg-brand-500/20',
            titleColor: 'text-brand-300',
            messageColor: 'text-brand-200/80',
            progressBar: 'bg-brand-500',
        },
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 pointer-events-none">
            <div className="pointer-events-auto animate-in slide-in-from-top-5 fade-in duration-300">
                <div className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br from-midnight/98 to-ocean/98 shadow-2xl backdrop-blur-xl max-w-md w-full`}>
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
                            backgroundSize: '24px 24px'
                        }} />
                    </div>

                    {/* Glow Effects */}
                    <div className={`absolute -top-16 -right-16 w-32 h-32 ${config.glowColor} rounded-full blur-3xl`} />
                    <div className={`absolute -bottom-16 -left-16 w-32 h-32 ${config.glowColor} rounded-full blur-3xl`} />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors z-10"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="relative p-6">
                        <div className="flex gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    {/* Pulsing Ring */}
                                    <div className={`absolute inset-0 rounded-full ${config.ringColor} animate-ping`} />

                                    {/* Icon Container */}
                                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor}`}>
                                        <Icon className={`w-6 h-6 ${config.iconColor}`} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-1">
                                {title && (
                                    <h3 className={`text-lg font-display font-bold ${config.titleColor} mb-1`}>
                                        {title}
                                    </h3>
                                )}
                                {message && (
                                    <p className={`text-sm ${config.messageColor} leading-relaxed`}>
                                        {message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Auto-close Progress Bar */}
                        {autoClose && (
                            <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${config.progressBar} rounded-full transition-all ease-linear`}
                                    style={{
                                        animation: `shrink ${autoCloseDuration}ms linear forwards`
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
        </div>
    );
}

// Hook for managing notifications
export function useNotification() {
    const [notification, setNotification] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
    });

    const showNotification = ({ type = 'success', title, message, autoClose = true, autoCloseDuration = 3000 }) => {
        setNotification({
            isOpen: true,
            type,
            title,
            message,
            autoClose,
            autoCloseDuration,
        });
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    return {
        notification,
        showNotification,
        closeNotification,
    };
}
