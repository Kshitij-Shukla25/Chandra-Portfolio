import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/types';
import { CATEGORIES } from '@/lib/utils';

function getCategoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-20 border-t border-white/8" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header row */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/30 uppercase mb-3"
               style={{ fontFamily: 'var(--font-body)' }}>
              Selected Work
            </p>
            <h2
              id="featured-heading"
              className="font-black uppercase leading-none text-white"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5vw, 72px)',
              }}
            >
              Featured
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="hidden sm:inline-flex items-center gap-2 text-[12px] tracking-widest text-white/35 hover:text-white transition-colors uppercase"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            All Work <ArrowRight size={13} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 6).map((p, i) => (
            <ProjectCard key={p.id} project={p} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block rounded-xl overflow-hidden bg-white/[0.03] border border-white/8 hover:border-white/16 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-outline-sm font-black uppercase"
              style={{ fontFamily: 'var(--font-display)', fontSize: '4rem' }}
              aria-hidden="true"
            >
              {project.title[0]}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white/60 tracking-wider uppercase"
                style={{ fontFamily: 'var(--font-body)' }}>
            {getCategoryLabel(project.category)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors uppercase tracking-wide line-clamp-1"
            style={{ fontFamily: 'var(--font-body)' }}>
          {project.title}
        </h3>
        <p className="text-xs text-white/35 mt-1 line-clamp-2 leading-relaxed"
           style={{ fontFamily: 'var(--font-body)' }}>
          {project.description}
        </p>
      </div>
    </Link>
  );
}
