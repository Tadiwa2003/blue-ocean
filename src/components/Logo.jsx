export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 blur-md opacity-80" />
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative h-10 w-10 text-white"
        >
          <defs>
            <linearGradient id="wave" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#7ad9ff" />
              <stop offset="50%" stopColor="#45c4fb" />
              <stop offset="100%" stopColor="#117ec1" />
            </linearGradient>
          </defs>
          <path
            d="M9 26c8-8 20-10 28-4s22 8 22 8-10 6-22 0-24-2-28 10"
            stroke="url(#wave)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 36c6-6 16-8 23-3s17 6 17 6-8 5-18 0-18-1-22 8"
            stroke="url(#wave)"
            strokeOpacity="0.6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg tracking-[0.35em] text-white">BLUE OCEAN</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-brand-200/80">
          CURATED GOODS
        </span>
      </span>
    </span>
  );
}
