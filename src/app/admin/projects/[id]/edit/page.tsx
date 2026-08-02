import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProjectForm from '@/components/admin/ProjectForm';
import { db } from '@/lib/db';
import { parseJsonField } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const raw = await db.project.findUnique({ where: { id } });
  if (!raw) notFound();

  const project = {
    ...raw,
    tags: parseJsonField<string[]>(raw.tags, []),
    software: parseJsonField<string[]>(raw.software, []),
    images: parseJsonField<string[]>(raw.images, []),
    videos: parseJsonField<string[]>(raw.videos, []),
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-4 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Back to Projects
        </Link>
        <h1 className="text-xl font-semibold text-white">Edit Project</h1>
        <p className="text-sm text-white/40 mt-1">{project.title}</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
