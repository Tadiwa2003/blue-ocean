import { useEffect, useState } from 'react';

export function CartNotification({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-6 z-[1002] max-w-sm">
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .notification-enter {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
      <div className={`rounded-2xl border border-brand-400/30 bg-gradient-to-br from-brand-500/20 to-brand-600/10 backdrop-blur-md px-6 py-4 shadow-lg notification-enter`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-6 w-6 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

