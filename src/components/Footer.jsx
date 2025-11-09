import { Logo } from './Logo.jsx';

const columns = [
  {
    title: 'Get Started',
    links: [
      { label: 'Sign up', href: '#cta' },
      { label: 'Login', href: '#cta' },
      { label: 'Request a tour', href: '#cta' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Capsule Library', href: '#retail' },
      { label: 'Spa Menu', href: '#spa' },
      { label: 'Pricing', href: '#cta' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#intro' },
      { label: 'Newsroom', href: '#journal' },
      { label: 'Partnerships', href: '#retail' },
      { label: 'Media Assets', href: '#journal' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms & Conditions', href: '#terms' },
      { label: 'AML Policy', href: '#privacy' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Developers', href: '#cta' },
      { label: 'FAQ', href: '#cta' },
      { label: 'Support', href: '#cta' },
      { label: 'Release Notes', href: '#cta' },
    ],
  },
];

const badges = [
  'UKAS Management Systems',
  'Cyber Essentials Certified',
  'ISO 27001 Certified',
  'EBA Associate Member',
  'FT 1000 Fastest Growing',
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-midnight pt-16 pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <a href="#hero" className="inline-flex hover:opacity-90">
              <Logo />
            </a>
            <p className="text-sm text-white/65">
              Blue Ocean &amp; Tana&apos;s Beauty Boost Spa deliver coastal-luxury retail capsules and sensory spa rituals
              with a single platform for teams and guests.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
              <span>English</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>USD · ZWG</span>
            </div>
          </div>
          <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {columns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">{column.title}</h4>
                <ul className="space-y-3 text-sm text-white/65">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="transition hover:text-white">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-xs text-white/55 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70"
                >
                  {badge}
                </span>
              ))}
            </div>
            <p className="md:max-w-sm">
              Blue Ocean Holdings Ltd is registered in Zimbabwe. Tana&apos;s Beauty Boost Spa is licensed under coastal wellness
              regulation 2025/04. Compliance statements available upon request.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 text-xs text-white/40">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Blue Ocean &amp; Tana&apos;s Beauty Boost Spa. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#privacy" className="transition hover:text-white">
                Privacy
              </a>
              <a href="#terms" className="transition hover:text-white">
                Terms
              </a>
              <a href="#cta" className="transition hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
