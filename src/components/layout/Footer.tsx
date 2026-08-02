import Link from 'next/link';
import type { SiteSettings } from '@/types';

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          <div>
            <p className="text-sm font-black tracking-[0.08em] uppercase text-white"
               style={{ fontFamily: 'var(--font-body)' }}>
              {settings.owner_name.toUpperCase()}
            </p>
            <p className="text-[11px] text-white/30 mt-1 tracking-wider"
               style={{ fontFamily: 'var(--font-body)' }}>
              {settings.owner_location}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
              {[
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/about', label: 'About' },
                { href: '/services', label: 'Services' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                        className="text-[12px] font-medium tracking-widest uppercase text-white/35 hover:text-white transition-colors"
                        style={{ fontFamily: 'var(--font-body)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-4">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer"
                 className="text-[11px] tracking-widest uppercase text-white/30 hover:text-white transition-colors"
                 style={{ fontFamily: 'var(--font-body)' }}>Instagram</a>
            )}
            {settings.social_linkedin && (
              <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer"
                 className="text-[11px] tracking-widest uppercase text-white/30 hover:text-white transition-colors"
                 style={{ fontFamily: 'var(--font-body)' }}>LinkedIn</a>
            )}
            {settings.social_canva && (
              <a href={settings.social_canva} target="_blank" rel="noopener noreferrer"
                 className="text-[11px] tracking-widest uppercase text-white/30 hover:text-white transition-colors"
                 style={{ fontFamily: 'var(--font-body)' }}>Canva</a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-[11px] text-white/20 tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
            © {year} {settings.owner_name}
          </p>
          <p className="text-[11px] text-white/15" style={{ fontFamily: 'var(--font-body)' }}>
            Every clip in color when you hover
          </p>
        </div>
      </div>
    </footer>
  );
}
