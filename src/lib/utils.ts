export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function parseJsonField<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const CATEGORIES = [
  { value: 'reels', label: 'Reels' },
  { value: 'ai-reels', label: 'AI Reels' },
  { value: 'motion-graphics', label: 'Motion Graphics' },
  { value: 'podcast', label: 'Podcast / Long-form' },
  { value: 'logo', label: 'Logo Design' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'print', label: 'Print Media' },
  { value: 'thumbnail', label: 'YouTube Thumbnail' },
  { value: 'branding', label: 'Branding' },
  { value: 'ui-ux', label: 'UI/UX Design' },
  { value: 'other', label: 'Other' },
] as const;

export type Category = (typeof CATEGORIES)[number]['value'];

export const SOFTWARE_LIST = [
  'Premiere Pro',
  'After Effects',
  'Photoshop',
  'Illustrator',
  'Figma',
  'DaVinci Resolve',
  'Canva',
  'CapCut',
  'Blender',
  'Cinema 4D',
];
