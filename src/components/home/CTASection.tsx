import Link from 'next/link';
import type { SiteSettings } from '@/types';
import { ArrowRight, Mail, Phone } from 'lucide-react';

export default function CTASection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-20 border-t border-white/8" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden p-10 sm:p-16">
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
            aria-hidden="true"
          />
          {/* Blue glow left */}
          <div
            className="absolute -left-24 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative text-center">
            <p className="text-[11px] tracking-[0.2em] text-white/30 uppercase mb-4"
               style={{ fontFamily: 'var(--font-body)' }}>
              Let&apos;s Work Together
            </p>
            <h2
              id="cta-heading"
              className="font-black uppercase leading-none text-white mb-4"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,7vw,100px)' }}
            >
              Let&apos;s Create.
            </h2>
            <p className="text-sm text-white/40 mb-10 max-w-md mx-auto leading-relaxed"
               style={{ fontFamily: 'var(--font-body)' }}>
              Got a project in mind? I&apos;m open to freelance work, full-time opportunities and creative collaborations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-12 px-8 bg-white text-black text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-white/90 transition-all"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Start a Conversation
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center h-12 px-8 border border-white/15 text-white/70 text-sm font-medium uppercase tracking-wider rounded-lg hover:border-white/30 hover:text-white transition-all"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Browse Work
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/25"
                 style={{ fontFamily: 'var(--font-body)' }}>
              {settings.owner_email && (
                <a href={`mailto:${settings.owner_email}`}
                   className="flex items-center gap-1.5 hover:text-white/50 transition-colors">
                  <Mail size={12} aria-hidden="true" />
                  {settings.owner_email}
                </a>
              )}
              {settings.owner_phone && (
                <a href={`tel:${settings.owner_phone.replace(/\s/g, '')}`}
                   className="flex items-center gap-1.5 hover:text-white/50 transition-colors">
                  <Phone size={12} aria-hidden="true" />
                  {settings.owner_phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
