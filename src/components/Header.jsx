import { Button } from './Button.jsx';
import { Logo } from './Logo.jsx';

const navigation = [
  { name: 'Platform', href: '#about' },
  { name: 'Offerings', href: '#offerings' },
  { name: 'Impact', href: '#impact' },
  { name: 'Founder', href: '#founder' },
  { name: 'Wholesale', href: '#wholesale' },
];

export function Header({ onSignInClick, onViewStorefront }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ocean/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#hero" className="transition hover:opacity-90">
          <Logo />
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="hover:text-white transition">
              {item.name}
            </a>
          ))}
        </nav>
        <div className="hidden gap-3 md:flex">
          <Button variant="ghost" onClick={onViewStorefront}>
            View Storefront
          </Button>
          <Button onClick={onSignInClick}>Sign In</Button>
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
