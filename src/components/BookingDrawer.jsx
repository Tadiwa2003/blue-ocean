import { useEffect } from 'react';
import { Button } from './Button.jsx';

const fallbackImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320">
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1da0e6" />
          <stop offset="100%" stop-color="#0b233e" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#grad)" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="rgba(255,255,255,0.85)">
        Spa Service
      </text>
    </svg>
  `);

const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export function BookingDrawer({
  bookings,
  isOpen,
  onClose,
  onCancelBooking,
  onClearBookings,
  onConfirmBookings,
  isConfirming = false,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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

  const totalInvestment = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  const currency = bookings[0]?.currency || 'USD';

  return (
    <div className="fixed inset-0 z-[1001] flex items-end justify-end sm:items-center sm:justify-center">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .booking-backdrop {
          animation: fadeIn 0.3s ease-out;
        }
        .booking-content {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="booking-backdrop absolute inset-0 bg-midnight/95 backdrop-blur-md" onClick={onClose} />

      <div className="booking-content relative flex h-full w-full flex-col border-l border-white/10 bg-gradient-to-br from-ocean/95 to-midnight/98 shadow-2xl sm:h-auto sm:w-[520px] sm:max-h-[90vh] sm:rounded-[32px] sm:border">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="font-display text-2xl text-white">Booking Summary</h2>
            <p className="mt-1 text-sm text-white/60">
              {bookings.length} {bookings.length === 1 ? 'service reserved' : 'services reserved'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="uppercase tracking-[0.2em]"
          >
            Close
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {bookings.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl">🧘‍♀️</div>
              <p className="text-lg font-semibold text-white">No sessions reserved yet</p>
              <p className="mt-1 text-sm text-white/60">Select a treatment to begin your spa itinerary.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={booking.image || fallbackImage}
                    alt={booking.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-white">{booking.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                        {booking.serviceCategory} · {booking.duration} MIN
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-brand-200">
                      {formatCurrency(booking.totalPrice || booking.basePrice, booking.currency)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs text-white/65">
                    <p>
                      <span className="font-semibold text-white/80">Date:</span> {booking.dateLabel || booking.date}
                    </p>
                    <p>
                      <span className="font-semibold text-white/80">Time:</span> {booking.time}
                    </p>
                    {booking.addOns?.length ? (
                      <p>
                        <span className="font-semibold text-white/80">Enhancements:</span>{' '}
                        {booking.addOns
                          .map((addOn) => addOn.name)
                          .join(', ')}
                      </p>
                    ) : null}
                    {booking.notes ? (
                      <p>
                        <span className="font-semibold text-white/80">Notes:</span> {booking.notes}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60">
                      <span>Therapist</span>
                      <span className="font-semibold text-white/75">{booking.therapistLevel}</span>
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onCancelBooking?.(booking.bookingId)}
                      className="text-xs uppercase tracking-[0.18em]"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {bookings.length > 0 && (
          <div className="space-y-4 border-t border-white/10 bg-gradient-to-t from-midnight/60 to-transparent p-6">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Service Subtotal</span>
              <span>{formatCurrency(totalInvestment, currency)}</span>
            </div>
            <div className="text-xs text-white/50">
              Taxes and gratuity are settled in-spa. A concierge will confirm within 15 minutes.
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={onClearBookings} 
                className="flex-1"
                disabled={isConfirming}
              >
                Clear All
              </Button>
              <Button 
                onClick={onConfirmBookings} 
                className="flex-1"
                disabled={isConfirming}
              >
                {isConfirming ? 'Confirming...' : 'Confirm Appointments'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
