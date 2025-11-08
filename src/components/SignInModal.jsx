import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';

// Mock user database for demonstration
const VALID_CREDENTIALS = [
  { email: 'founder@blueocean.co', password: 'blueocean2024', name: 'Kim Moyo', role: 'owner' },
  { email: 'admin@blueocean.co', password: 'admin123', name: 'Admin User', role: 'admin' },
  { email: 'user@blueocean.co', password: 'user123', name: 'Test User', role: 'user' },
];

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setEmail('');
      setPassword('');
      setError('');
      setIsSubmitting(false);
    }
  }, [open]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Validate email format
  const validateEmail = (email) => {
    return EMAIL_REGEX.test(email);
  };

  // Validate password strength (minimum 6 characters for demo)
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    // Email format validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate API call with authentication check
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check credentials against mock database
      const user = VALID_CREDENTIALS.find(
        (cred) => cred.email.toLowerCase() === email.toLowerCase().trim() && cred.password === password
      );

      if (!user) {
        setError('Invalid email or password. Please try again.');
      setIsSubmitting(false);
        return;
      }

      // Success - pass user data to onSuccess callback
      onSuccess({
        name: user.name,
        email: user.email,
        role: user.role,
      });

      // Reset form
      setEmail('');
      setPassword('');
      setIsSubmitting(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-midnight/80 px-4 py-10 backdrop-blur">
      <div className="absolute inset-0" onClick={isSubmitting ? undefined : onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-ocean/80 shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,160,230,0.25),_transparent_70%)]" />
        <div className="relative p-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-6 top-6 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Close
          </button>
          <div className="space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-200/80">Welcome back</p>
            <h2 className="font-display text-3xl text-white">Sign in to Blue Ocean</h2>
            <p className="text-sm text-white/60">
              Access your dashboard, storefront tools, rich reports, and analytics.
            </p>
          </div>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-white/50">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(''); // Clear error when user starts typing
                }}
                placeholder="you@blueocean.co"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs uppercase tracking-[0.3em] text-white/50">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError(''); // Clear error when user starts typing
                }}
                placeholder="Enter your password"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="rounded-2xl border border-brand-200/30 bg-brand-200/10 px-4 py-3">
                <p className="text-sm font-medium text-brand-200">{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in…</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className="mt-6 space-y-3">
            <p className="text-center text-xs text-white/50">
              Forgot password?{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setError('Password reset feature coming soon. Contact support for assistance.');
                }}
                className="text-brand-300 hover:text-brand-200 transition"
              >
                Reset here
              </button>
            </p>
            <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">Demo Credentials</p>
              <div className="space-y-1 text-xs text-white/60">
                <p>Owner: founder@blueocean.co / blueocean2024</p>
                <p>Admin: admin@blueocean.co / admin123</p>
                <p>User: user@blueocean.co / user123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
