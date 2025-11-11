import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';
import { User, Mail, Lock, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex min-h-screen w-full"
      >
        {/* Left Side - Sign In/Sign Up Form */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-midnight/95 backdrop-blur-xl overflow-y-auto"
        >
          <div className="w-full max-w-md space-y-8 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute -top-4 right-0 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Close
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-500/20 backdrop-blur-sm mb-4"
              >
                <Shield className="w-8 h-8 text-brand-300" />
              </motion.div>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-3xl font-bold tracking-tight text-white"
              >
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </motion.h1>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/70"
              >
                {mode === 'signup'
                  ? 'Join Blue Ocean and start managing your retail and spa operations.'
                  : 'Sign in to access your dashboard, storefront tools, and analytics.'}
              </motion.p>
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

            {/* Form Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 shadow-xl"
            >
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Name field for sign-up */}
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className="text-sm font-medium text-white/90">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
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
                        className="w-full h-11 pl-10 pr-3 rounded-lg border border-white/10 bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        required={mode === 'signup'}
                        autoComplete="name"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mode === 'signup' ? 0.35 : 0.3 }}
                  className="space-y-2"
                >
                  <label htmlFor="email" className="text-sm font-medium text-white/90">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError('');
                      }}
                      placeholder="name@example.com"
                      disabled={isSubmitting}
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-white/10 bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      required
                      autoComplete={mode === 'signup' ? 'email' : 'email'}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mode === 'signup' ? 0.4 : 0.35 }}
                  className="space-y-2"
                >
                  <label htmlFor="password" className="text-sm font-medium text-white/90">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
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
                      className="w-full h-11 pl-10 pr-10 rounded-lg border border-white/10 bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      required
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-xs text-white/50 px-1">
                      Must be at least 6 characters with uppercase, lowercase, and number
                    </p>
                  )}
                </motion.div>

                {/* Confirm Password for sign-up */}
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="space-y-2"
                  >
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-white/90">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
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
                        className="w-full h-11 pl-10 pr-10 rounded-lg border border-white/10 bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        required={mode === 'signup'}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg border border-brand-200/30 bg-brand-200/10 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-brand-200">{error}</p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mode === 'signup' ? 0.5 : 0.4 }}
                >
                  <Button type="submit" className="w-full justify-center h-11" disabled={isSubmitting}>
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
                </motion.div>
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
                      className="text-brand-300 hover:text-brand-200 transition font-medium"
                    >
                      Reset here
                    </button>
                  </p>
                )}
                {mode === 'signin' && (
                  <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-3">
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
                    <a href="#terms" className="text-brand-300 hover:text-brand-200 transition font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#privacy" className="text-brand-300 hover:text-brand-200 transition font-medium">
                      Privacy Policy
                    </a>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Gradient Hero Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        >
          {/* Animated Blobs */}
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500/30 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>

          {/* Gradient Wave */}
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 560">
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path fill="url(#gradient1)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,560L1392,560C1344,560,1248,560,1152,560C1056,560,960,560,864,560C768,560,672,560,576,560C480,560,384,560,288,560C192,560,96,560,48,560L0,560Z" />
            </svg>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex items-center justify-center p-8 lg:p-12 w-full">
            <div className="text-center space-y-6 max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-4"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl lg:text-4xl font-bold text-white"
              >
                {mode === 'signup' ? 'Join Blue Ocean' : 'Secure Authentication'}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-white/80"
              >
                {mode === 'signup'
                  ? 'Your data is protected with industry-standard encryption. Start your journey with confidence.'
                  : 'Your data is protected with industry-standard encryption and security measures. Sign in with confidence.'}
              </motion.p>
              {/* Progress Dots */}
              <div className="flex justify-center gap-2 pt-4">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: index <= 1 ? 1 : 0.4 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
