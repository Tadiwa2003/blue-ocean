import { useState } from 'react';
import { Button } from './Button.jsx';

export function SignInModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      setEmail('');
      setPassword('');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-midnight/80 px-4 py-10 backdrop-blur">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-ocean/80 shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,160,230,0.25),_transparent_70%)]" />
        <div className="relative p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@blueocean.co"
                className="h-12 w-full rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none"
                required
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
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none"
                required
              />
            </div>
            {error ? <p className="text-sm text-brand-200">{error}</p> : null}
            <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-white/50">
            Forgot password? <a href="#" className="text-brand-300 hover:text-brand-200">Reset here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
