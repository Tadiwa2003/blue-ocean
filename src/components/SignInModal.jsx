import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../services/api.js';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInModal({ open, onClose, onSuccess, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'

  // Update mode when initialMode prop changes
  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [initialMode, open]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setIsSubmitting(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open, mode]);

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

  // Validate password strength for sign-up
  const validatePasswordStrength = (password) => {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number.' };
    }
    return { valid: true, message: '' };
  };

  const handleSignUp = async () => {
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend API
      const response = await api.auth.signUp({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (response.success) {
        // Success - pass user data to onSuccess callback
        setError('');
        setIsSubmitting(false);
        
        // Small delay to show success state
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        onSuccess({
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
        });

        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign-up. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async () => {
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

    try {
      // Call backend API
      const response = await api.auth.signIn(email.toLowerCase().trim(), password);

      if (response.success) {
        // Success - pass user data to onSuccess callback
        onSuccess({
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
        });

        // Reset form
        setEmail('');
        setPassword('');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (mode === 'signup') {
      await handleSignUp();
    } else {
      await handleSignIn();
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
            <p className="text-xs uppercase tracking-[0.4em] text-brand-200/80">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </p>
            <h2 className="font-display text-3xl text-white">
              {mode === 'signup' ? 'Join Blue Ocean' : 'Sign in to Blue Ocean'}
            </h2>
            <p className="text-sm text-white/60">
              {mode === 'signup'
                ? 'Start managing your retail and spa operations in minutes.'
                : 'Access your dashboard, storefront tools, rich reports, and analytics.'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mt-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-brand-500/30 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-brand-500/30 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* Name field for sign-up */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-full border border-white/10 bg-white/10 px-5 pl-12 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                  required={mode === 'signup'}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
                <Mail className="w-4 h-4" />
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@blueocean.co"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-full border border-white/10 bg-white/10 pl-12 pr-5 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                  required
                  autoComplete={mode === 'signup' ? 'email' : 'email'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-full border border-white/10 bg-white/10 pl-12 pr-12 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-white/50 px-1">
                  Must be at least 6 characters with uppercase, lowercase, and number
                </p>
              )}
            </div>

            {/* Confirm Password for sign-up */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Confirm your password"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-full border border-white/10 bg-white/10 pl-12 pr-12 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                    required={mode === 'signup'}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
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
                  <span>{mode === 'signup' ? 'Creating account…' : 'Signing in…'}</span>
                </>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>
          <div className="mt-6 space-y-3">
            {mode === 'signin' && (
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
            )}
            {mode === 'signin' && (
              <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">Demo Credentials</p>
                <div className="space-y-1 text-xs text-white/60">
                  <p>Owner: founder@blueocean.co / blueocean2024</p>
                  <p>Admin: admin@blueocean.co / admin123</p>
                  <p>User: user@blueocean.co / user123</p>
                </div>
              </div>
            )}
            {mode === 'signup' && (
              <p className="text-center text-xs text-white/50">
                By signing up, you agree to our{' '}
                <a href="#terms" className="text-brand-300 hover:text-brand-200 transition">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-brand-300 hover:text-brand-200 transition">
                  Privacy Policy
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
