'use client';

import Link from 'next/link';
import type { SiteSettings } from '@/types';

interface HeroProps {
  settings: SiteSettings;
}

export default function HeroSection({ settings }: HeroProps) {
  // Name layout:
  //  Line 1 (filled):   HELLO, I'M
  //  Line 2 (filled):   CHANDRA        ← first word only
  //  Line 3 (outlined): MANI           ← second word only (third word "MISHRA" removed)
  const nameParts = settings.owner_name.trim().split(/\s+/);
  const filledLine = nameParts[0].toUpperCase();
  const outlinedWord = nameParts[1]?.toUpperCase() ?? '';

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-[rgb(10,10,12)]"
      aria-label="Hero"
    >
      {/* Blue radial glow — top right, matches image */}
      <div
        className="hero-glow absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content — starts below navbar */}
      <div className="relative flex-1 flex flex-col justify-start pt-[52px]">

        {/* "PORTFOLIO — 2026" label */}
        <div className="mx-auto w-full max-w-[1400px] px-6 pt-8 pb-0">
          <p
            className="text-[11px] tracking-[0.22em] text-white/35 uppercase font-medium"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Portfolio — 2026
          </p>
        </div>

        {/* Giant headline block */}
        <div className="mx-auto w-full max-w-[1400px] px-6 pt-2 pb-0">
          {/*
            Typography breakdown from image:
            Line 1: "HELLO, I'M"  — filled white, huge condensed
            Line 2: "CHANDRA"     — filled white, huge condensed (slightly larger)
            Line 3: "MANI"        — outlined / stroked, same huge size
          */}
          <div
            className="leading-[0.88] font-black uppercase select-none"
            style={{ fontFamily: 'var(--font-display)' }}
            aria-label={`Hello, I'm ${settings.owner_name}`}
          >
            {/* Line 1: HELLO, I'M */}
            <div
              className="block text-white"
              style={{
                fontSize: 'clamp(72px, 13vw, 185px)',
                lineHeight: 0.9,
              }}
              aria-hidden="true"
            >
              HELLO, I&apos;M
            </div>

            {/* Line 2: CHANDRA (filled) */}
            <div
              className="block text-white"
              style={{
                fontSize: 'clamp(80px, 15.5vw, 220px)',
                lineHeight: 0.9,
                marginTop: '-0.02em',
              }}
              aria-hidden="true"
            >
              {filledLine}
            </div>

            {/* Line 3: MANI (outlined — no fill, just stroke) */}
            <div
              className="block text-outline"
              style={{
                fontSize: 'clamp(80px, 15.5vw, 220px)',
                lineHeight: 0.9,
                marginTop: '-0.01em',
              }}
              aria-hidden="true"
            >
              {outlinedWord}
            </div>
          </div>

          {/* Subtitle — below the outlined name, left-aligned, matches image */}
          <p
            className="mt-6 text-[14px] leading-relaxed text-white/55 max-w-[380px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {settings.owner_title} — {settings.hero_tagline || settings.site_description}
          </p>
        </div>
      </div>
    </section>
  );
}
