'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Project } from '@/types';
import { CATEGORIES, cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface PortfolioGridProps {
  projects: Project[];
  initialCategory?: string;
}

function getCategoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export default function PortfolioGrid({
  projects,
  initialCategory = 'all',
}: PortfolioGridProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    let result = projects;

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.client?.toLowerCase().includes(q) ?? false) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.software.some((s) => s.toLowerCase().includes(q))
      );
    }

    return result;
  }, [projects, category, search]);

  // Get unique categories from projects
  const usedCategories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return CATEGORIES.filter((c) => cats.has(c.value));
  }, [projects]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search projects, clients, tools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-colors"
            aria-label="Search projects"
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            onClick={() => setCategory('all')}
            className={cn(
              'px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest transition-all',
              category === 'all'
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/8 hover:text-white/70'
            )}
            style={{ fontFamily: 'var(--font-body)' }}
            aria-pressed={category === 'all'}
          >
            All ({projects.length})
          </button>
          {usedCategories.map((cat) => {
            const count = projects.filter((p) => p.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest transition-all',
                  category === cat.value
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/8 hover:text-white/70'
                )}
                style={{ fontFamily: 'var(--font-body)' }}
                aria-pressed={category === cat.value}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-white/30 mb-6">
        {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <SlidersHorizontal size={32} className="text-white/20 mb-4" aria-hidden="true" />
          <p className="text-white/40 text-sm mb-2">No projects found</p>
          <p className="text-white/25 text-xs">Try a different search or category</p>
          <button
            onClick={() => { setSearch(''); setCategory('all'); }}
            className="mt-4 text-xs text-white/40 hover:text-white underline underline-offset-4 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} priority={i < 6} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white/3 border border-white/8 hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/2">
            <span className="text-white/10 text-6xl font-bold">
              {project.title[0]}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/60 backdrop-blur-sm text-white/70 border-white/10 text-[10px]">
            {getCategoryLabel(project.category)}
          </Badge>
        </div>
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20 text-[10px]">
              Featured
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          {project.client && (
            <span className="text-[10px] text-white/25">{project.client}</span>
          )}
          {project.software.length > 0 && (
            <div className="flex gap-1 ml-auto">
              {project.software.slice(0, 2).map((s) => (
                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
