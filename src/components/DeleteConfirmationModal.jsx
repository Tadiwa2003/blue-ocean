import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button.jsx';
import { useEffect } from 'react';

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, storefrontName, loading = false }) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-midnight/98 to-ocean/98 shadow-2xl shadow-red-500/10 animate-in zoom-in-95 duration-300">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(239, 68, 68, 0.15) 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />
                </div>

                {/* Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute right-4 top-4 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative p-8">
                    {/* Warning Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {/* Pulsing Ring */}
                            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />

                            {/* Icon Container */}
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/20 border-2 border-red-500/40 shadow-lg shadow-red-500/20">
                                <AlertTriangle className="w-10 h-10 text-red-400" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-display font-bold text-white text-center mb-3">
                        Delete Storefront?
                    </h2>

                    {/* Storefront Name */}
                    <div className="mb-6 text-center">
                        <p className="text-white/70 text-sm mb-2">You are about to delete:</p>
                        <div className="inline-block px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30">
                            <p className="text-lg font-semibold text-red-300">"{storefrontName}"</p>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mb-8 p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <span className="text-red-400 text-xs font-bold">!</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2 text-sm text-white/80">
                                <p className="font-semibold text-red-300">This action cannot be undone.</p>
                                <ul className="space-y-1 text-white/60">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        <span>The storefront will be permanently deleted</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        <span>Products and services will remain but won't be linked</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        <span>All customizations and settings will be lost</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-0 shadow-lg shadow-red-500/30 hover:shadow-red-500/40"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Deleting...
                                </span>
                            ) : (
                                'Delete Storefront'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
