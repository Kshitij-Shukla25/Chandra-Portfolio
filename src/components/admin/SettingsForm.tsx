'use client';

import { useState } from 'react';
import { updateSettings } from '@/lib/actions/settings';
import type { SiteSettings } from '@/types';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

interface Props {
  settings: SiteSettings;
}

export default function SettingsForm({ settings: initial }: Props) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateSettings(settings);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Identity */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">Identity</h2>
        <Input label="Owner Name" value={settings.owner_name} onChange={set('owner_name')} />
        <Input label="Title / Role" value={settings.owner_title} onChange={set('owner_title')} />
        <Textarea label="Bio" value={settings.owner_bio} onChange={set('owner_bio')} rows={5} />
      </section>

      {/* Site */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">SEO & Metadata</h2>
        <Input label="Site Title" value={settings.site_title} onChange={set('site_title')} />
        <Textarea label="Site Description (meta)" value={settings.site_description} onChange={set('site_description')} rows={3} />
        <Input label="Hero Tagline" value={settings.hero_tagline} onChange={set('hero_tagline')} />
        <Input label="OG Image URL" value={settings.og_image} onChange={set('og_image')} placeholder="https://…" />
      </section>

      {/* Stats */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Creatives" value={settings.stats_creatives} onChange={set('stats_creatives')} placeholder="1000+" />
          <Input label="Videos" value={settings.stats_videos} onChange={set('stats_videos')} placeholder="300+" />
          <Input label="Brands" value={settings.stats_brands} onChange={set('stats_brands')} placeholder="50+" />
          <Input label="Years" value={settings.stats_years} onChange={set('stats_years')} placeholder="5+" />
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">Contact</h2>
        <Input label="Email" type="email" value={settings.owner_email} onChange={set('owner_email')} />
        <Input label="Phone" value={settings.owner_phone} onChange={set('owner_phone')} />
        <Input label="Location" value={settings.owner_location} onChange={set('owner_location')} />
        <Input label="Resume URL" value={settings.resume_url} onChange={set('resume_url')} placeholder="https://…" />
      </section>

      {/* Social */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">Social Links</h2>
        <Input label="Instagram URL" value={settings.social_instagram} onChange={set('social_instagram')} placeholder="https://instagram.com/…" />
        <Input label="LinkedIn URL" value={settings.social_linkedin} onChange={set('social_linkedin')} placeholder="https://linkedin.com/in/…" />
        <Input label="Canva Portfolio URL" value={settings.social_canva} onChange={set('social_canva')} placeholder="https://canva.com/…" />
      </section>

      <div className="flex items-center gap-3 pt-4 border-t border-white/8">
        <Button type="submit" loading={saving}>Save Settings</Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <CheckCircle size={13} aria-hidden="true" />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
