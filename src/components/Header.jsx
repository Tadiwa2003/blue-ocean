import { Button } from './Button.jsx';
import { Logo } from './Logo.jsx';

const navSections = [
  {
    label: 'Personal',
    type: 'menu',
    items: [
      { name: 'Blue Ocean Capsules', href: '#retail' },
      { name: 'Tana’s Spa Menu', href: '#spa' },
    ],
  },
  {
    label: 'Business',
    type: 'link',
    href: '#cta',
  },
  {
    label: 'Company',
    type: 'menu',
    items: [
      { name: 'Our Story', href: '#intro' },
      { name: 'Partnerships', href: '#retail' },
      { name: 'Media Kit', href: '#journal' },
      { name: 'Release Notes', href: '#cta' },
    ],
  },
];

export function Header({ onSignInClick, onSignUpClick, onViewStorefront, onViewSpaStorefront }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ocean/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#hero" className="transition hover:opacity-90">
          <Logo />
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          {navSections.map((section) =>
            section.type === 'menu' ? (
              <div key={section.label} className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-white/80 transition hover:text-white"
                >
                  {section.label}
                  <span className="text-xs opacity-60">▾</span>
                </button>
                <div className="invisible absolute left-0 top-full mt-2 min-w-[220px] rounded-2xl border border-white/10 bg-ocean/95 p-2 shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {section.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-xl px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={section.label} href={section.href} className="rounded-full px-3 py-1 text-white/80 transition hover:text-white">
                {section.label}
              </a>
            )
          )}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" onClick={onSignInClick}>
            Log in
          </Button>
          <Button onClick={onSignUpClick || onSignInClick}>Sign up</Button>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
        >
          <span className="sr-only">Open menu</span>
          ☰
        </button>
      </div>
    </header>
  );
}
