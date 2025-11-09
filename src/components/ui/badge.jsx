import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-brand-400/40 bg-brand-500/20 text-brand-100',
        secondary: 'border-white/15 bg-white/10 text-white/70',
        outline: 'border-white/15 text-white/70',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
