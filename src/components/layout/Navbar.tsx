'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/portfolio?category=reels', label: 'VIDEO' },
  { href: '/portfolio?category=logo', label: 'GRAPHIC' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

interface NavbarProps {
  ownerName?: string;
}

export default function Navbar({ ownerName = 'CHANDRA MANI MISHRA' }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const displayName = ownerName.toUpperCase();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled ? 'bg-[rgb(10,10,12)]/95 backdrop-blur-sm' : 'bg-[rgb(10,10,12)]'
        }`}
      >
        {/* 1px bottom border — very subtle, matches image */}
        <div className="border-b border-white/8">
          <nav
            className="mx-auto max-w-[1400px] px-6 h-[52px] flex items-center justify-between"
            aria-label="Main navigation"
          >
            {/* Brand — bold condensed caps, matches image perfectly */}
            <Link
              href="/"
              className="text-white font-black tracking-[0.08em] text-sm uppercase hover:text-white/80 transition-colors"
              style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.06em' }}
              aria-label="Home"
            >
              {displayName}
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-7" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[13px] font-medium tracking-[0.1em] transition-colors ${
                      pathname === link.href.split('?')[0]
                        ? 'text-white'
                        : 'text-white/55 hover:text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-[52px] left-0 right-0 bg-[#0d0d0f] border-b border-white/10 px-6 py-6">
            <ul className="flex flex-col gap-1" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex py-3 text-sm font-medium tracking-widest text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
