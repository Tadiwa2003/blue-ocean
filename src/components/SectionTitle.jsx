import { clsx } from 'clsx';

export function SectionTitle({ eyebrow, title, description, align = 'start', className }) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-3',
        align === 'center' && 'text-center items-center',
        align === 'end' && 'text-right items-end',
        className
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl sm:text-4xl text-white max-w-xl leading-tight">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm text-white/70 leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
