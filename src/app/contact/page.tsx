import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import ContactForm from '@/components/contact/ContactForm';
import { getSettings } from '@/lib/actions/settings';
import { Mail, Phone, MapPin, Link2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for freelance projects, full-time roles or creative collaborations.',
};

export const revalidate = 3600;

const display = { fontFamily: 'var(--font-display)' };
const body = { fontFamily: 'var(--font-body)' };

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <PublicLayout>
      <div className="mx-auto max-w-[1400px] px-6 pt-[52px]">

        {/* Header */}
        <div className="pt-10 pb-14 border-b border-white/8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3" style={body}>
            Reach Out
          </p>
          <h1
            className="font-black uppercase leading-none text-white"
            style={{ ...display, fontSize: 'clamp(48px, 9vw, 130px)' }}
          >
            Let&apos;s Create
          </h1>
          <h1
            className="font-black uppercase leading-none text-outline"
            style={{ ...display, fontSize: 'clamp(48px, 9vw, 130px)' }}
          >
            Together
          </h1>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 py-16">

          {/* Contact info sidebar */}
          <aside className="lg:col-span-2 space-y-8">
            <p className="text-sm text-white/40 leading-relaxed max-w-xs" style={body}>
              Whether it&apos;s a quick reel or a full brand overhaul — I&apos;m open to work.
              Drop a message and I&apos;ll respond within 24 hours.
            </p>

            <div className="space-y-5">
              {settings.owner_email && (
                <a href={`mailto:${settings.owner_email}`} className="flex items-start gap-4 group">
                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0 group-hover:border-white/20 transition-colors">
                    <Mail size={14} className="text-white/40" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5" style={body}>Email</p>
                    <p className="text-sm text-white/65 group-hover:text-white transition-colors" style={body}>
                      {settings.owner_email}
                    </p>
                  </div>
                </a>
              )}

              {settings.owner_phone && (
                <a href={`tel:${settings.owner_phone.replace(/\s/g, '')}`} className="flex items-start gap-4 group">
                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0 group-hover:border-white/20 transition-colors">
                    <Phone size={14} className="text-white/40" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5" style={body}>Phone / WhatsApp</p>
                    <p className="text-sm text-white/65 group-hover:text-white transition-colors" style={body}>
                      {settings.owner_phone}
                    </p>
                  </div>
                </a>
              )}

              {settings.owner_location && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-white/40" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5" style={body}>Location</p>
                    <p className="text-sm text-white/65" style={body}>{settings.owner_location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social */}
            <div className="pt-6 border-t border-white/8">
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3" style={body}>Find me on</p>
              <div className="flex flex-wrap gap-2">
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white hover:border-white/20 transition-colors uppercase tracking-wider"
                     style={body}>
                    <Link2 size={12} aria-hidden="true" /> Instagram
                  </a>
                )}
                {settings.social_linkedin && (
                  <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white hover:border-white/20 transition-colors uppercase tracking-wider"
                     style={body}>
                    <Link2 size={12} aria-hidden="true" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
