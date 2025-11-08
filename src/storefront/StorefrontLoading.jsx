export function StorefrontLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-midnight text-white">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-4 border-brand-400/40 border-t-transparent" />
        <span
          className="absolute inset-3 animate-[spin_3s_linear_infinite] rounded-full border-4 border-white/10 border-b-transparent"
          style={{ animationDirection: 'reverse' }}
        />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-400 to-brand-600 shadow-glow">
          <span className="text-xl font-semibold">BO</span>
        </span>
      </div>
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-200">Loading storefront</p>
        <h2 className="mt-3 font-display text-3xl">Preparing Blue Ocean experience…</h2>
        <p className="mt-2 max-w-md text-sm text-white/70">
          We are setting the tide—importing featured products, styling ambient visuals, and warming the buying journey.
        </p>
      </div>
    </div>
  );
}
