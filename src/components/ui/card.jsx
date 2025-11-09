import { cn } from '../../lib/utils.js';

export function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-white shadow-[0_30px_80px_rgba(8,22,48,0.45)] backdrop-blur',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn('grid gap-2 px-2 text-left sm:px-0', className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return <div data-slot="card-title" className={cn('font-display text-xl font-semibold text-white', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return (
    <div data-slot="card-description" className={cn('text-sm text-white/70', className)} {...props} />
  );
}

export function CardAction({ className, ...props }) {
  return (
    <div data-slot="card-action" className={cn('justify-self-end', className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn('px-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div data-slot="card-footer" className={cn('flex items-center gap-3 px-0', className)} {...props} />;
}
