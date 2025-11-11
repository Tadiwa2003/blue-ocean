import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 text-white shadow-sm shadow-black/5 hover:from-brand-400 hover:via-brand-500 hover:to-brand-600 hover:shadow-glow',
        destructive: 'bg-red-500 text-white shadow-sm shadow-black/5 hover:bg-red-600',
        outline: 'border border-white/20 bg-white/5 text-white shadow-sm shadow-black/5 hover:bg-white/10 hover:text-white backdrop-blur-md',
        secondary: 'bg-white/10 text-white shadow-sm shadow-black/5 hover:bg-white/20 backdrop-blur-md border border-white/15',
        ghost: 'text-white/75 hover:text-white hover:bg-white/10 border border-white/0 hover:border-white/10',
        link: 'text-brand-300 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-lg px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  icon: Icon,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 mr-2" aria-hidden="true" /> : null}
      {children}
    </Comp>
  );
}
