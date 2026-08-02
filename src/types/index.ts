export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  brief?: string | null;
  category: string;
  tags: string[];
  client?: string | null;
  timeline?: string | null;
  software: string[];
  coverImage?: string | null;
  thumbnail?: string | null;
  images: string[];
  videos: string[];
  projectUrl?: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string | null;
  role?: string | null;
  content: string;
  rating: number;
  avatar?: string | null;
  published: boolean;
  order: number;
  createdAt: Date;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'video' | 'pdf' | 'gif';
  size: number;
  mimeType: string;
  folder: string;
  createdAt: Date;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
}

export interface SiteSettings {
  site_title: string;
  site_description: string;
  owner_name: string;
  owner_title: string;
  owner_bio: string;
  owner_email: string;
  owner_phone: string;
  owner_location: string;
  social_instagram: string;
  social_linkedin: string;
  social_canva: string;
  stats_creatives: string;
  stats_videos: string;
  stats_brands: string;
  stats_years: string;
  hero_tagline: string;
  resume_url: string;
  og_image: string;
}

export interface FilterParams {
  category?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}
