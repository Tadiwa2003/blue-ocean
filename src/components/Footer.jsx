import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Waves } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { Button } from './Button.jsx';

gsap.registerPlugin(ScrollTrigger);

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
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const columnsRef = useRef(null);
  const badgesRef = useRef(null);
  const copyrightRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;

    // Animate footer entrance
    const footer = footerRef.current;

    // Logo animation
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: logoRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Columns animation
    if (columnsRef.current) {
      const columnItems = columnsRef.current.querySelectorAll('div');
      gsap.fromTo(
        columnItems,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: columnsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Badges animation
    if (badgesRef.current) {
      const badgeItems = badgesRef.current.querySelectorAll('span');
      gsap.fromTo(
        badgeItems,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          stagger: 0.08,
          scrollTrigger: {
            trigger: badgesRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Copyright animation
    if (copyrightRef.current) {
      gsap.fromTo(
        copyrightRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: copyrightRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Link hover animations
    const links = footer.querySelectorAll('a');
    const linkListeners = [];
    links.forEach((link) => {
      const handleEnter = () => {
        gsap.to(link, {
          x: 4,
          duration: 0.3,
          ease: 'power2.out',
        });
      };
      const handleLeave = () => {
        gsap.to(link, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      };
      link.addEventListener('mouseenter', handleEnter);
      link.addEventListener('mouseleave', handleLeave);
      linkListeners.push({ link, handleEnter, handleLeave });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === footer) {
          trigger.kill();
        }
      });

      linkListeners.forEach(({ link, handleEnter, handleLeave }) => {
        link.removeEventListener('mouseenter', handleEnter);
        link.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0A192F] via-[#07152B] to-[#050F1F] pt-20 pb-14"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/20 blur-[140px]" />
        <div className="absolute top-1/2 left-10 h-64 w-64 -translate-y-1/2 rounded-full bg-brand-400/10 blur-[120px]" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-[160px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40" />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 relative">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-8 sm:p-10 backdrop-blur-xl">
          <div className="absolute -top-24 right-16 h-44 w-44 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.35em] text-white/70">
                <Waves className="h-4 w-4 text-brand-200" />
                Tidal Concierge
              </span>
              <h3 className="font-display text-3xl text-white sm:text-4xl">
                Design your next laboratory launch and spa ritual with our team.
              </h3>
              <p className="text-sm text-white/70 sm:text-base">
                Book a co-creation lab to shape immersive wellness products, laboratory diagnostics, and coastal retail
                experiences tailored to your brand.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild className="w-full sm:w-auto" icon={ArrowUpRight}>
                <a href="mailto:Tanasbeautyboost@gmail.com?subject=Schedule%20a%20Blue%20Ocean%20strategy%20session">
                  Schedule Strategy Session
                </a>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <a href="#cta">Explore Packages</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div ref={logoRef} className="max-w-sm space-y-4">
            <a href="#hero" className="inline-flex hover:opacity-90">
              <Logo />
            </a>
            <p className="text-sm text-white/65">
              BrightPath &amp; Tana&apos;s Beauty Boost Spa deliver coastal-luxury retail capsules and sensory spa rituals
              with a single platform for teams and guests.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
              <span>English</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>USD · ZWG</span>
            </div>
          </div>
          <div ref={columnsRef} className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {columns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">
                  {column.title}
                </h4>
                <ul className="space-y-3 text-sm text-white/65">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-white/65 transition hover:text-white"
                      >
                        <span>{link.label}</span>
                        <span className="h-1 w-1 rounded-full bg-white/10 transition-all group-hover:w-2 group-hover:bg-brand-300" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-xs text-white/60 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div ref={badgesRef} className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 transition-all hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-brand-200"
                >
                  {badge}
                </span>
              ))}
            </div>
            <p className="md:max-w-sm">
              BrightPath Holdings Ltd is registered in Zimbabwe. Tana&apos;s Beauty Boost Spa is licensed under coastal wellness
              regulation 2025/04. Compliance statements available upon request.
            </p>
          </div>
        </div>

        <div ref={copyrightRef} className="border-t border-white/5 pt-6 text-xs text-white/40">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} BrightPath &amp; Tana&apos;s Beauty Boost Spa. All rights reserved.</p>
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
