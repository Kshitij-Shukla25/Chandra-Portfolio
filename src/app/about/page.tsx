import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import { getSettings } from '@/lib/actions/settings';
import { ArrowDownToLine } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Chandra Mani Mishra — 5+ years in video editing, graphic design and UI/UX.',
};

export const revalidate = 3600;

const experience = [
  {
    period: '2026 — Present',
    company: 'Elaris Consulting Pvt. Ltd.',
    role: 'Graphics, UI/UX Design & Video Editor',
    desc: 'Leading all visual communication for a real estate company — ad creatives, Figma website design, social media content and video production.',
  },
  {
    period: '2023 — 2026',
    company: 'DGB Training & Consulting Pvt. Ltd.',
    role: 'Graphics Designer & Video Editor',
    desc: '500+ social creatives, 300+ videos/reels produced. Built and maintained brand consistency across all digital channels.',
  },
  {
    period: '2021 — 2023',
    company: 'Uprist Service Portal Pvt. Ltd.',
    role: 'Graphics Designer & Video Editor',
    desc: 'End-to-end creative production for a service platform — brand design, social media content, video editing.',
  },
];

const skills = [
  { name: 'Premiere Pro', level: 98 },
  { name: 'After Effects', level: 92 },
  { name: 'Photoshop', level: 95 },
  { name: 'Illustrator', level: 88 },
  { name: 'Figma (UI/UX)', level: 85 },
  { name: 'DaVinci Resolve', level: 75 },
  { name: 'Canva', level: 96 },
];

/* Shared font style helpers */
const display = { fontFamily: 'var(--font-display)' };
const body = { fontFamily: 'var(--font-body)' };

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <PublicLayout>
      <div className="mx-auto max-w-[1400px] px-6 pt-[52px]">

        {/* ── PAGE HEADER ───────────────────────────────── */}
        <div className="pt-10 pb-14 border-b border-white/8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3" style={body}>
            About
          </p>
          <h1
            className="font-black uppercase leading-none text-white"
            style={{ ...display, fontSize: 'clamp(48px, 9vw, 130px)' }}
          >
            {settings.owner_name.split(' ').slice(0, -1).join(' ')}
          </h1>
          <h1
            className="font-black uppercase leading-none text-outline"
            style={{ ...display, fontSize: 'clamp(48px, 9vw, 130px)' }}
          >
            {settings.owner_name.split(' ').at(-1)}
          </h1>
          <p className="text-sm text-white/40 mt-4 tracking-wide" style={body}>
            {settings.owner_title}
          </p>
        </div>

        {/* ── BIO + STATS ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-16 border-b border-white/8">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-5" style={body}>
              Background
            </p>
            {settings.owner_bio.split('\n\n').map((para, i) => (
              <p key={i} className="text-[15px] text-white/55 leading-loose" style={body}>
                {para}
              </p>
            ))}
            {settings.resume_url && (
              <a
                href={settings.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 h-10 px-5 border border-white/15 text-white/60 text-sm font-medium uppercase tracking-wider rounded-lg hover:border-white/30 hover:text-white transition-colors"
                style={body}
              >
                <ArrowDownToLine size={14} aria-hidden="true" />
                Download Resume
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 content-start">
            {[
              { value: settings.stats_creatives, label: 'Creatives\nDelivered' },
              { value: settings.stats_videos, label: 'Videos\nProduced' },
              { value: settings.stats_brands, label: 'Brands\nWorked With' },
              { value: settings.stats_years, label: 'Years of\nExperience' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-xl border border-white/8 bg-white/[0.02] text-center hover:bg-white/[0.04] transition-colors"
              >
                <p className="font-black text-white tabular-nums" style={{ ...display, fontSize: 'clamp(28px,3.5vw,44px)' }}>
                  {stat.value}
                </p>
                <p className="text-[11px] text-white/30 mt-1 leading-snug whitespace-pre-line uppercase tracking-wider" style={body}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPERIENCE ────────────────────────────────── */}
        <div className="py-16 border-b border-white/8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3" style={body}>
            Work History
          </p>
          <h2
            className="font-black uppercase leading-none text-white mb-12"
            style={{ ...display, fontSize: 'clamp(32px, 5vw, 72px)' }}
          >
            Experience
          </h2>

          <ol className="space-y-0 relative" aria-label="Work experience">
            {experience.map((job, i) => (
              <li key={i} className="relative pl-8 pb-10 last:pb-0">
                <div className="absolute left-0 top-2 bottom-0 w-px bg-white/8" aria-hidden="true" />
                <div className="absolute left-[-3px] top-2 w-1.5 h-1.5 rounded-full bg-white/25" aria-hidden="true" />
                <time className="text-[11px] text-white/30 tracking-widest uppercase block mb-1" style={body}>
                  {job.period}
                </time>
                <h3 className="text-[15px] font-semibold text-white uppercase tracking-wide mb-0.5" style={body}>
                  {job.company}
                </h3>
                <p className="text-xs text-white/45 mb-2 tracking-wide" style={body}>{job.role}</p>
                <p className="text-sm text-white/35 leading-relaxed max-w-lg" style={body}>{job.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── SOFTWARE ──────────────────────────────────── */}
        <div className="py-16">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3" style={body}>
            Tools & Stack
          </p>
          <h2
            className="font-black uppercase leading-none text-white mb-12"
            style={{ ...display, fontSize: 'clamp(32px, 5vw, 72px)' }}
          >
            Software
          </h2>
          <ul className="space-y-5 max-w-lg" role="list">
            {skills.map((s) => (
              <li key={s.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-white/65 tracking-wide uppercase text-[12px]" style={body}>
                    {s.name}
                  </span>
                  <span className="text-[11px] text-white/25 tabular-nums" style={body}>{s.level}%</span>
                </div>
                <div className="h-px bg-white/8">
                  <div
                    className="h-full bg-white/35"
                    style={{ width: `${s.level}%` }}
                    role="progressbar"
                    aria-valuenow={s.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={s.name}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </PublicLayout>
  );
}
