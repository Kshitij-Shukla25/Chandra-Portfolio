import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import PortfolioGrid from '@/components/portfolio/PortfolioGrid';
import { getProjects } from '@/lib/actions/projects';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Browse all creative work — reels, motion graphics, brand identity, social media, UI/UX and more.',
};

export const revalidate = 60;

const display = { fontFamily: 'var(--font-display)' };
const body = { fontFamily: 'var(--font-body)' };

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const projects = await getProjects({ limit: 100 });

  return (
    <PublicLayout>
      <div className="mx-auto max-w-[1400px] px-6 pt-[52px]">

        {/* Header */}
        <div className="pt-10 pb-14 border-b border-white/8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3" style={body}>
            Work
          </p>
          <h1
            className="font-black uppercase leading-none text-white"
            style={{ ...display, fontSize: 'clamp(48px, 9vw, 130px)' }}
          >
            Portfolio
          </h1>
          <p className="text-sm text-white/35 mt-4 max-w-md leading-relaxed" style={body}>
            A collection of creative work across video, design, motion and branding.
          </p>
        </div>

        <div className="pt-10 pb-20">
          <PortfolioGrid
            projects={projects}
            initialCategory={params.category || 'all'}
          />
        </div>

      </div>
    </PublicLayout>
  );
}
