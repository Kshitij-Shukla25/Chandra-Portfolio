import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import SessionProvider from '@/components/providers/SessionProvider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // The login page renders without this layout (see app/admin/login/layout.tsx)
  // This layout only runs for protected admin pages
  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex bg-[#0a0a0a]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader user={session.user} />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
