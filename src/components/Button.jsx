import { clsx } from 'clsx';

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300';

const variants = {
  primary:
    'bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 text-white hover:from-brand-400 hover:via-brand-500 hover:to-brand-600 hover:shadow-glow active:from-brand-600 active:via-brand-500 active:to-brand-700',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/15',
  ghost:
    'text-white/75 hover:text-white hover:bg-white/10 border border-white/0 hover:border-white/10',
};

export function Button({ variant = 'primary', className, icon: Icon, children, ...props }) {
  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
