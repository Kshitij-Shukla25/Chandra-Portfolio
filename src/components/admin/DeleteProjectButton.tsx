'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProject } from '@/lib/actions/projects';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
  title: string;
}

export default function DeleteProjectButton({ id, title }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    await deleteProject(id);
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-[10px] text-white/40 hover:text-white rounded transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2 py-1 text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
        >
          {loading ? '…' : 'Delete'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      aria-label={`Delete ${title}`}
    >
      <Trash2 size={14} aria-hidden="true" />
    </button>
  );
}
