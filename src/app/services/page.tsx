import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Video editing, graphic design, motion graphics, branding and UI/UX design services.',
};

const display = { fontFamily: 'var(--font-display)' };
const body = { fontFamily: 'var(--font-body)' };

const services = [
  {
    tag: 'Video',
    title: 'Video Editing',
    desc: 'From raw footage to polished final cut — short-form reels, long-form YouTube, podcast edits, and ad creatives.',
    deliverables: ['Instagram Reels & YouTube Shorts', 'Long-form & Podcast', 'Ad videos (15s, 30s, 60s)', 'AI-generated visual reels', 'Multi-cam editing', 'Color grading & audio cleanup'],
  },
  {
    tag: 'Motion',
    title: 'Motion Graphics',
    desc: 'Animated typography, logo stings, lower thirds and explainer animations built in After Effects.',
    deliverables: ['Logo reveal animations', 'Animated social templates', 'Title cards & lower thirds', 'Explainer animations', 'Kinetic typography', 'Intro / Outro sequences'],
  },
  {
    tag: 'Design',
    title: 'Graphic Design',
    desc: 'Brand-consistent visuals across every touchpoint — digital and print, built to scale.',
    deliverables: ['Social posts & carousels', 'Story & reel covers', 'Brochures & flyers', 'Banners & standees', 'Posters & event collateral', 'YouTube thumbnails'],
  },
  {
    tag: 'Identity',
    title: 'Brand Identity',
    desc: 'Logo design and full identity systems — from concept to complete brand guidelines.',
    deliverables: ['Logo design + variations', 'Color & typography system', 'Brand guidelines doc', 'Business card design', 'Letterhead & stationery', 'Brand patterns & assets'],
  },
  {
    tag: 'Social',
    title: 'Social Media',
    desc: 'Ongoing creative production for Instagram, LinkedIn, Facebook — consistent and scroll-stopping.',
    deliverables: ['Monthly content calendars', 'Feed posts & carousels', 'Story templates', 'Profile branding', 'Campaign creative sets', 'Ad creatives (static + video)'],
  },
  {
    tag: 'UI/UX',
    title: 'UI / UX Design',
    desc: 'Figma-first digital product and website design — clean, usable, on-brand.',
    deliverables: ['Website design in Figma', 'Landing pages', 'Mobile app UI', 'Design system components', 'Prototype & user flows', 'Handoff-ready files'],
  },
];

export default function ServicesPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-[1400px] px-6 pt-[52px]">

        {/* Header */}
        <div className="pt-10 pb-14 border-b border-white/8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3" style={body}>
            What I Offer
          </p>
          <h1
            className="font-black uppercase leading-none text-white"
            style={{ ...display, fontSize: 'clamp(48px, 9vw, 130px)' }}
          >
            Services
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-14 border-b border-white/8">
          {services.map((s) => (
            <article
              key={s.title}
              className="flex flex-col p-6 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12 transition-colors"
            >
              <div className="flex items-start justify-between mb-5">
                <span
                  className="font-black uppercase text-white/90 leading-none"
                  style={{ ...display, fontSize: 'clamp(20px, 2.5vw, 32px)' }}
                >
                  {s.title}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-white/25 uppercase tracking-widest shrink-0 ml-2"
                  style={body}
                >
                  {s.tag}
                </span>
              </div>

              <p className="text-xs text-white/40 leading-relaxed mb-5 flex-1" style={body}>
                {s.desc}
              </p>

              <ul className="space-y-1.5" role="list">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-xs text-white/35" style={body}>
                    <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="py-16 text-center">
          <h2
            className="font-black uppercase leading-none text-white mb-4"
            style={{ ...display, fontSize: 'clamp(36px, 6vw, 88px)' }}
          >
            Ready to Start?
          </h2>
          <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto leading-relaxed" style={body}>
            Drop a message with what you need and I&apos;ll respond within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 h-12 px-8 bg-white text-black text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-white/90 transition-all"
            style={body}
          >
            Get in Touch <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </PublicLayout>
  );
}
