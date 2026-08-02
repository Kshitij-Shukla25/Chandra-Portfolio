import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllProjectsAdmin, deleteProject } from '@/lib/actions/projects';
import DeleteProjectButton from '@/components/admin/DeleteProjectButton';
import { CATEGORIES } from '@/lib/utils';

function getCategoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-white/40 mt-1">{projects.length} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-white text-black text-xs font-medium rounded-lg hover:bg-white/90 transition-colors"
        >
          <Plus size={14} aria-hidden="true" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 rounded-xl border border-dashed border-white/10 text-center">
          <p className="text-sm text-white/30 mb-4">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-white text-black text-xs font-medium rounded-lg hover:bg-white/90 transition-colors"
          >
            <Plus size={14} aria-hidden="true" />
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className="px-4 py-3 text-left text-xs text-white/30 font-normal">Title</th>
                <th className="px-4 py-3 text-left text-xs text-white/30 font-normal hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs text-white/30 font-normal hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-left text-xs text-white/30 font-normal hidden lg:table-cell">Featured</th>
                <th className="px-4 py-3 text-right text-xs text-white/30 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm text-white/80">{project.title}</span>
                    {project.client && (
                      <span className="text-xs text-white/30 block">{project.client}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-white/40">
                      {getCategoryLabel(project.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        project.published
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-white/8 text-white/40'
                      }`}
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {project.featured ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                        aria-label={`Edit ${project.title}`}
                      >
                        <Pencil size={14} aria-hidden="true" />
                      </Link>
                      <DeleteProjectButton id={project.id} title={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
