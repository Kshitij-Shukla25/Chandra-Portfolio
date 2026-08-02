import { db } from '@/lib/db';
import Link from 'next/link';
import { FolderOpen, Image, Star, MessageSquare, ArrowRight } from 'lucide-react';

export default async function AdminDashboard() {
  const [projectCount, mediaCount, testimonialCount, unreadMessages] =
    await Promise.all([
      db.project.count(),
      db.media.count(),
      db.testimonial.count(),
      db.contactSubmission.count({ where: { read: false } }),
    ]);

  const recentProjects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, title: true, category: true, published: true, createdAt: true },
  });

  const stats = [
    { label: 'Projects', value: projectCount, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-400' },
    { label: 'Media Files', value: mediaCount, icon: Image, href: '/admin/media', color: 'text-purple-400' },
    { label: 'Testimonials', value: testimonialCount, icon: Star, href: '/admin/testimonials', color: 'text-yellow-400' },
    { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, href: '/admin/messages', color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Overview of your portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-4 rounded-xl bg-white/3 border border-white/8 hover:bg-white/5 hover:border-white/12 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={16} className={stat.color} aria-hidden="true" />
              <ArrowRight
                size={12}
                className="text-white/20 group-hover:text-white/40 transition-colors"
                aria-hidden="true"
              />
            </div>
            <p className="text-2xl font-semibold text-white tabular-nums">
              {stat.value}
            </p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white/70">Recent Projects</h2>
          <Link
            href="/admin/projects/new"
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            + Add new
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-white/10 text-center">
            <p className="text-sm text-white/30 mb-3">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="text-xs text-white/50 hover:text-white transition-colors underline underline-offset-4"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/8 overflow-hidden">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-white/8 bg-white/2">
                  <th className="px-4 py-3 text-left text-xs text-white/30 font-normal">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-white/30 font-normal hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-white/30 font-normal">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="text-white/80 hover:text-white transition-colors text-sm"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-white/40">{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          p.published
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-white/8 text-white/40'
                        }`}
                      >
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-medium text-white/70 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/projects/new', label: 'Add Project' },
            { href: '/admin/media', label: 'Upload Media' },
            { href: '/admin/testimonials', label: 'Manage Testimonials' },
            { href: '/admin/settings', label: 'Edit Settings' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-xs text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
