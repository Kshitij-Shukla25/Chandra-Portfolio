'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import type { User } from 'next-auth';

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-white/8 bg-[#0a0a0a] shrink-0 sticky top-0 z-10">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-xs text-white/30">{user.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={13} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </header>
  );
}
