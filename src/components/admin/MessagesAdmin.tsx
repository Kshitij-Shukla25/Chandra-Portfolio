'use client';

import { useState } from 'react';
import { markContactRead } from '@/lib/actions/contact';
import type { ContactSubmission } from '@/types';
import { formatDate } from '@/lib/utils';
import { Mail, MailOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  submissions: ContactSubmission[];
}

export default function MessagesAdmin({ submissions: initial }: Props) {
  const [submissions, setSubmissions] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleExpand = async (s: ContactSubmission) => {
    setExpanded(expanded === s.id ? null : s.id);
    if (!s.read) {
      await markContactRead(s.id);
      setSubmissions((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, read: true } : x))
      );
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
        <Mail size={24} className="text-white/20 mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm text-white/30">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {submissions.map((s) => (
        <div
          key={s.id}
          className={`rounded-xl border transition-colors ${
            s.read ? 'border-white/8 bg-white/2' : 'border-white/12 bg-white/4'
          }`}
        >
          <button
            onClick={() => handleExpand(s)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
            aria-expanded={expanded === s.id}
          >
            <span className="shrink-0 text-white/30">
              {s.read ? (
                <MailOpen size={15} aria-hidden="true" />
              ) : (
                <Mail size={15} className="text-blue-400" aria-hidden="true" />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`text-sm ${s.read ? 'text-white/60' : 'text-white font-medium'}`}>
                  {s.name}
                </span>
                <span className="text-xs text-white/30">{s.email}</span>
                {!s.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" aria-label="Unread" />
                )}
              </div>
              {s.subject && (
                <p className="text-xs text-white/40 truncate">{s.subject}</p>
              )}
            </div>
            <span className="text-xs text-white/25 shrink-0 hidden sm:block">
              {formatDate(s.createdAt)}
            </span>
            {expanded === s.id ? (
              <ChevronUp size={14} className="text-white/30 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown size={14} className="text-white/30 shrink-0" aria-hidden="true" />
            )}
          </button>

          {expanded === s.id && (
            <div className="px-4 pb-4 border-t border-white/8 pt-3">
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                {s.message}
              </p>
              <div className="flex gap-3 mt-3">
                <a
                  href={`mailto:${s.email}?subject=Re: ${s.subject || 'Your message'}`}
                  className="text-xs text-white/40 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Reply via email
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
