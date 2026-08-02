import { getContactSubmissions, markContactRead } from '@/lib/actions/contact';
import { formatDate } from '@/lib/utils';
import MessagesAdmin from '@/components/admin/MessagesAdmin';

export default async function AdminMessagesPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Messages</h1>
        <p className="text-sm text-white/40 mt-1">
          {submissions.filter((s) => !s.read).length} unread ·{' '}
          {submissions.length} total
        </p>
      </div>
      <MessagesAdmin submissions={submissions} />
    </div>
  );
}
