import clsx from 'clsx';

export function GradientBackground({ children, className = '' }) {
  return (
    <div className={clsx('gradient-background relative min-h-screen w-full', className)}>
      <div className="gradient-background__layer gradient-background__layer--base" />
      <div className="gradient-background__layer gradient-background__layer--texture" />
      <div className="gradient-background__layer gradient-background__layer--grid" />
      <div className="gradient-background__layer gradient-background__layer--diagonal" />
      <div className="gradient-background__layer gradient-background__layer--liquid" />
      <div className="gradient-background__content relative z-10">{children}</div>
    </div>
  );
}
