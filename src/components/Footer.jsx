import { Logo } from './Logo.jsx';

const footerLinks = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '#collections' },
      { label: 'Signature Sets', href: '#collections' },
      { label: 'Oceanic Rituals', href: '#collections' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '#story' },
      { label: 'Wholesale', href: '#wholesale' },
      { label: 'Careers', href: '#journal' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', href: '#cta' },
      { label: 'Shipping & Returns', href: '#faq' },
      { label: 'FAQs', href: '#faq' },
    ],
  },
];

const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Pinterest', href: 'https://pinterest.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-midnight py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:justify-between">
        <div className="max-w-sm space-y-4">
          <a href="#hero" className="inline-flex hover:opacity-90">
            <Logo />
          </a>
          <p className="text-sm text-white/60">
            Blue Ocean curates salt-soaked fragrances, tactile ceramics, and resort-ready essentials inspired by the rhythm of the coast.
          </p>
          <div className="flex gap-4 text-sm text-white/70">
            {socials.map((social) => (
              <a key={social.label} href={social.href} className="hover:text-white transition" target="_blank">
                {social.label}
              </a>
            ))}
          </div>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                {group.title}
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 border-t border-white/5 px-6 pt-6 text-xs text-white/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Blue Ocean. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white">Privacy</a>
            <a href="#terms" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
