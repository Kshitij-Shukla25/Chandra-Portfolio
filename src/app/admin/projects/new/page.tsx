import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
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
        <h1 className="text-xl font-semibold text-white">New Project</h1>
        <p className="text-sm text-white/40 mt-1">Add a new portfolio project</p>
      </div>
      <ProjectForm />
    </div>
  );
}
