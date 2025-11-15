import { useEffect, useState } from 'react';
import { Button } from './Button.jsx';
import { AlertCircle } from 'lucide-react';
import { PhoneInput } from './PhoneInput.jsx';
import { convertDateLabelToISO, isPastDateTime, getRelativeDateLabel } from '../utils/dateHelpers.js';

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
  onUpdateGuestInfo,
}) {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestError, setGuestError] = useState('');

  // Ensure bookings is an array
  const bookingsArray = Array.isArray(bookings) ? bookings : [];

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
      // Initialize guest info from first booking if available, or from existing bookings
      const firstBooking = bookingsArray[0];
      if (firstBooking) {
        setGuestName(firstBooking.guestName || '');
        setGuestEmail(firstBooking.guestEmail || '');
        setGuestPhone(firstBooking.guestPhone || '');
      }
      setGuestError('');
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, bookings, bookingsArray]);

  if (!isOpen) return null;
  
  // Debug logging in development
  if (import.meta.env.DEV && isOpen) {
    console.log('📋 BookingDrawer opened with bookings:', {
      count: bookingsArray.length,
      bookings: bookingsArray,
    });
  }
  
  const totalInvestment = bookingsArray.reduce((sum, booking) => sum + (booking.totalPrice || booking.basePrice || 0), 0);
  const currency = bookingsArray[0]?.currency || 'USD';

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
              {bookingsArray.length} {bookingsArray.length === 1 ? 'service reserved' : 'services reserved'}
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
          {bookingsArray.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl">🧘‍♀️</div>
              <p className="text-lg font-semibold text-white">No sessions reserved yet</p>
              <p className="mt-1 text-sm text-white/60">Select a treatment to begin your spa itinerary.</p>
            </div>
          ) : (
            bookingsArray.map((booking) => (
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
                      <span className="font-semibold text-white/80">Date:</span>{' '}
                      {(() => {
                        // Ensure we display a valid date label
                        const dateValue = booking.date || '';
                        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                        if (dateRegex.test(dateValue)) {
                          return booking.dateLabel || getRelativeDateLabel(dateValue);
                        }
                        // If date is not valid ISO, try to convert it
                        const isoDate = convertDateLabelToISO(dateValue || booking.dateLabel);
                        return isoDate ? getRelativeDateLabel(isoDate) : (booking.dateLabel || booking.date || 'Please select a date');
                      })()}
                    </p>
                    <p>
                      <span className="font-semibold text-white/80">Time:</span> {booking.time || 'Please select a time'}
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
                    {booking.guestEmail ? (
                      <p>
                        <span className="font-semibold text-white/80">Guest Email:</span> {booking.guestEmail}
                      </p>
                    ) : null}
                    {booking.guestPhone ? (
                      <p>
                        <span className="font-semibold text-white/80">Guest Phone:</span> {booking.guestPhone}
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

        {bookingsArray.length > 0 && (
          <div className="space-y-4 border-t border-white/10 bg-gradient-to-t from-midnight/60 to-transparent p-6">
            {/* Guest Contact Information */}
            <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Your Contact Information
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    setGuestError('');
                    if (onUpdateGuestInfo) {
                      onUpdateGuestInfo({ name: e.target.value, email: guestEmail, phone: guestPhone });
                    }
                  }}
                  placeholder="Your name *"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => {
                    setGuestEmail(e.target.value);
                    setGuestError('');
                    if (onUpdateGuestInfo) {
                      onUpdateGuestInfo({ name: guestName, email: e.target.value, phone: guestPhone });
                    }
                  }}
                  placeholder="Your email address *"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
                <PhoneInput
                  value={guestPhone}
                  onChange={(e) => {
                    setGuestPhone(e.target.value);
                    setGuestError('');
                    if (onUpdateGuestInfo) {
                      onUpdateGuestInfo({ name: guestName, email: guestEmail, phone: e.target.value });
                    }
                  }}
                  placeholder="Phone number *"
                  required
                  defaultCountry="ZW"
                  className="w-full"
                />
              </div>
              {guestError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                  <AlertCircle className="h-4 w-4 text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200">{guestError}</p>
                </div>
              )}
              <p className="text-xs text-white/50">
                We'll send booking confirmation to your email address. All fields marked with * are required.
              </p>
            </div>

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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isConfirming && onClearBookings) {
                    onClearBookings();
                  }
                }} 
                className="flex-1"
                disabled={isConfirming}
                type="button"
                aria-label="Clear all bookings"
              >
                Clear All
              </Button>
              <Button 
                variant="default"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Validate name, email, and phone before confirming
                  if (!guestName || !guestName.trim()) {
                    setGuestError('Please enter your name to confirm your booking.');
                    return;
                  }
                  
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!guestEmail || !emailRegex.test(guestEmail.trim())) {
                    setGuestError('Please enter a valid email address to receive booking confirmation.');
                    return;
                  }
                  
                  if (!guestPhone || !guestPhone.trim()) {
                    setGuestError('Please enter your phone number to confirm your booking.');
                    return;
                  }
                  
                  // Validate all bookings have valid dates and times
                  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                  const validationErrors = [];
                  
                  bookingsArray.forEach((booking, index) => {
                    const bookingNum = index + 1;
                    let bookingDate = booking.date || '';
                    
                    // Convert date if not in ISO format
                    if (!dateRegex.test(bookingDate)) {
                      bookingDate = convertDateLabelToISO(bookingDate || booking.dateLabel);
                      if (!bookingDate || !dateRegex.test(bookingDate)) {
                        validationErrors.push(`Booking ${bookingNum}: Please select a valid date.`);
                        return;
                      }
                    }
                    
                    // Validate time exists
                    if (!booking.time || booking.time.trim() === '') {
                      validationErrors.push(`Booking ${bookingNum}: Please select a time.`);
                      return;
                    }
                    
                    // Validate date is not in the past
                    if (bookingDate && booking.time) {
                      if (isPastDateTime(bookingDate, booking.time)) {
                        // Try to auto-fix by using tomorrow
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const tomorrowISO = tomorrow.toISOString().split('T')[0];
                        
                        // Check if tomorrow with the same time would work
                        if (!isPastDateTime(tomorrowISO, booking.time)) {
                          // Auto-fix is possible - update the booking
                          booking.date = tomorrowISO;
                          booking.dateLabel = getRelativeDateLabel(tomorrowISO);
                          console.log(`⚠️ Auto-fixed booking ${bookingNum} date to tomorrow in drawer`);
                        } else {
                          // Can't auto-fix - time is too early even for tomorrow
                          validationErrors.push(`Booking ${bookingNum}: The selected time is too early. Please select a later time.`);
                        }
                      }
                    }
                  });
                  
                  if (validationErrors.length > 0) {
                    setGuestError(validationErrors[0] + (validationErrors.length > 1 ? ` (and ${validationErrors.length - 1} more)` : ''));
                    return;
                  }
                  
                  setGuestError('');
                  
                  // Update all bookings with guest info before confirming
                  if (onUpdateGuestInfo) {
                    onUpdateGuestInfo({ name: guestName, email: guestEmail, phone: guestPhone });
                  }
                  
                  if (!isConfirming && bookingsArray && bookingsArray.length > 0 && onConfirmBookings) {
                    onConfirmBookings();
                  }
                }} 
                className="flex-1 font-semibold text-base py-3 !bg-gradient-to-r !from-brand-500 !via-brand-400 !to-brand-600 !text-white !shadow-lg !shadow-brand-500/40 hover:!from-brand-400 hover:!via-brand-500 hover:!to-brand-600 hover:!shadow-glow hover:!shadow-brand-500/50 active:scale-[0.98] transition-all duration-200 disabled:!opacity-50 disabled:!cursor-not-allowed"
                disabled={isConfirming || !bookingsArray || bookingsArray.length === 0}
                type="button"
                aria-label={isConfirming ? 'Confirming bookings...' : 'Confirm booking'}
                aria-busy={isConfirming}
              >
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Confirming...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
