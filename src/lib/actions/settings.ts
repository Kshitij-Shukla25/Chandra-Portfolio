'use server';

import { db } from '@/lib/db';
import type { SiteSettings } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getSettings(): Promise<SiteSettings> {
  const settings = await db.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }

  return {
    site_title: map.site_title ?? 'Portfolio',
    site_description: map.site_description ?? '',
    owner_name: map.owner_name ?? 'Chandra Mani Mishra',
    owner_title: map.owner_title ?? 'Graphic Designer · Video Editor',
    owner_bio: map.owner_bio ?? '',
    owner_email: map.owner_email ?? '',
    owner_phone: map.owner_phone ?? '',
    owner_location: map.owner_location ?? '',
    social_instagram: map.social_instagram ?? '',
    social_linkedin: map.social_linkedin ?? '',
    social_canva: map.social_canva ?? '',
    stats_creatives: map.stats_creatives ?? '1000+',
    stats_videos: map.stats_videos ?? '300+',
    stats_brands: map.stats_brands ?? '50+',
    stats_years: map.stats_years ?? '5+',
    hero_tagline: map.hero_tagline ?? '',
    resume_url: map.resume_url ?? '',
    og_image: map.og_image ?? '',
  };
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<void> {
  const entries = Object.entries(data) as [string, string][];

  await Promise.all(
    entries.map(([key, value]) =>
      db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
  revalidatePath('/admin/settings');
}
