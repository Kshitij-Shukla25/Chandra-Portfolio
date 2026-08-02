import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, User, Wrench } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getProjectBySlug, getProjects } from '@/lib/actions/projects';
import { CATEGORIES, formatDate } from '@/lib/utils';

const display = { fontFamily: 'var(--font-display)' };
const body = { fontFamily: 'var(--font-body)' };

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getProjects({ limit: 200 });
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const categoryLabel = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;
  const relatedRaw = await getProjects({ category: project.category, limit: 4 });
  const related = relatedRaw.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-[1400px] px-6 pt-[52px]">

        {/* Back */}
        <div className="pt-8 pb-6">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors group"
            style={body}
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
            Portfolio
          </Link>
        </div>

        {/* Title block */}
        <div className="pb-10 border-b border-white/8">
          <span className="text-[10px] uppercase tracking-widest text-white/30 mb-3 block" style={body}>
            {categoryLabel}
          </span>
          <h1
            className="font-black uppercase leading-none text-white mb-4"
            style={{ ...display, fontSize: 'clamp(36px, 7vw, 100px)' }}
          >
            {project.title}
          </h1>
          <p className="text-[15px] text-white/50 max-w-2xl leading-relaxed" style={body}>
            {project.description}
          </p>
        </div>

        {/* Cover */}
        {project.coverImage && (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 my-10">
            <Image
              src={project.coverImage}
              alt={`${project.title} cover`}
              fill
              className="object-cover"
              sizes="(max-width:1400px) 100vw, 1400px"
              priority
            />
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {project.client && (
            <div className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[10px] text-white/25 uppercase tracking-widest mb-1.5" style={body}>
                <User size={11} aria-hidden="true" /> Client
              </div>
              <p className="text-sm text-white/70" style={body}>{project.client}</p>
            </div>
          )}
          {project.timeline && (
            <div className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[10px] text-white/25 uppercase tracking-widest mb-1.5" style={body}>
                <Calendar size={11} aria-hidden="true" /> Timeline
              </div>
              <p className="text-sm text-white/70" style={body}>{project.timeline}</p>
            </div>
          )}
          <div className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-[10px] text-white/25 uppercase tracking-widest mb-1.5" style={body}>
              <Calendar size={11} aria-hidden="true" /> Year
            </div>
            <p className="text-sm text-white/70" style={body}>
              {new Date(project.createdAt).getFullYear()}
            </p>
          </div>
          {project.software.length > 0 && (
            <div className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[10px] text-white/25 uppercase tracking-widest mb-1.5" style={body}>
                <Wrench size={11} aria-hidden="true" /> Tools
              </div>
              <p className="text-sm text-white/70" style={body}>{project.software.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Brief */}
        {project.brief && (
          <div className="mb-12 max-w-2xl">
            <h2 className="text-[11px] uppercase tracking-widest text-white/25 mb-4" style={body}>
              About this project
            </h2>
            <p className="text-[15px] text-white/55 leading-loose" style={body}>{project.brief}</p>
          </div>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {project.tags.map((tag) => (
              <span key={tag}
                    className="text-[10px] px-3 py-1 rounded border border-white/10 text-white/35 uppercase tracking-widest"
                    style={body}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Videos */}
        {project.videos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[11px] uppercase tracking-widest text-white/25 mb-6" style={body}>Videos</h2>
            <div className="space-y-4">
              {project.videos.map((video, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
                  <video src={video} controls className="w-full h-full object-cover" preload="metadata"
                         title={`${project.title} video ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {project.images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[11px] uppercase tracking-widest text-white/25 mb-6" style={body}>Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/5">
                  <Image
                    src={img}
                    alt={`${project.title} — ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live link */}
        {project.projectUrl && (
          <div className="mb-12">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-5 border border-white/15 text-white/60 text-sm uppercase tracking-widest rounded-lg hover:border-white/30 hover:text-white transition-colors"
              style={body}
            >
              View live project <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/8 pb-16">
            <h2
              className="font-black uppercase leading-none text-white mb-8"
              style={{ ...display, fontSize: 'clamp(28px,4vw,56px)' }}
            >
              Related
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/portfolio/${r.slug}`}
                  className="group block rounded-xl overflow-hidden border border-white/8 bg-white/[0.02] hover:border-white/15 transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-white/5">
                    {r.coverImage ? (
                      <Image src={r.coverImage} alt={r.title} fill
                             className="object-cover group-hover:scale-105 transition-transform duration-500"
                             sizes="33vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-black uppercase text-outline-sm"
                              style={{ ...display, fontSize: '3rem' }}>{r.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70 group-hover:text-white line-clamp-1 transition-colors" style={body}>
                      {r.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </PublicLayout>
  );
}
