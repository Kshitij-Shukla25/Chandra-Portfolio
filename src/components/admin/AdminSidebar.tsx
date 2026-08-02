'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Image,
  MessageSquare,
  Settings,
  Eye,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-white/8 flex flex-col bg-[#0a0a0a] sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="px-4 h-14 flex items-center border-b border-white/8 shrink-0">
        <Link href="/admin" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-white text-black text-xs font-bold flex items-center justify-center">
            CM
          </span>
          <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4" aria-label="Admin navigation">
        <ul className="space-y-0.5" role="list">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <item.icon size={15} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* View site */}
      <div className="px-2 pb-4 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
        >
          <Eye size={14} aria-hidden="true" />
          View Site
        </a>
      </div>
    </aside>
  );
}
