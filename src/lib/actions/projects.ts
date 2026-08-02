'use server';

import { db } from '@/lib/db';
import { parseJsonField, slugify } from '@/lib/utils';
import type { Project, FilterParams } from '@/types';
import { revalidatePath } from 'next/cache';

function serializeProject(p: {
  id: string;
  title: string;
  slug: string;
  description: string;
  brief: string | null;
  category: string;
  tags: string;
  client: string | null;
  timeline: string | null;
  software: string;
  coverImage: string | null;
  thumbnail: string | null;
  images: string;
  videos: string;
  projectUrl: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}): Project {
  return {
    ...p,
    tags: parseJsonField<string[]>(p.tags, []),
    software: parseJsonField<string[]>(p.software, []),
    images: parseJsonField<string[]>(p.images, []),
    videos: parseJsonField<string[]>(p.videos, []),
  };
}

export async function getProjects(params: FilterParams = {}): Promise<Project[]> {
  const { category, search, featured, page = 1, limit = 20 } = params;

  const where: Record<string, unknown> = { published: true };

  if (category && category !== 'all') {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { client: { contains: search } },
    ];
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  const projects = await db.project.findMany({
    where,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    skip: (page - 1) * limit,
    take: limit,
  });

  return projects.map(serializeProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const project = await db.project.findUnique({ where: { slug } });
  if (!project) return null;
  return serializeProject(project);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return getProjects({ featured: true, limit: 6 });
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const projects = await db.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  return projects.map(serializeProject);
}

export async function createProject(data: {
  title: string;
  description: string;
  brief?: string;
  category: string;
  tags?: string[];
  client?: string;
  timeline?: string;
  software?: string[];
  coverImage?: string;
  thumbnail?: string;
  images?: string[];
  videos?: string[];
  projectUrl?: string;
  featured?: boolean;
  published?: boolean;
}): Promise<Project> {
  const slug = slugify(data.title);

  // Ensure unique slug
  let finalSlug = slug;
  let counter = 1;
  while (await db.project.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${slug}-${counter++}`;
  }

  const project = await db.project.create({
    data: {
      title: data.title,
      slug: finalSlug,
      description: data.description,
      brief: data.brief || null,
      category: data.category,
      tags: JSON.stringify(data.tags || []),
      client: data.client || null,
      timeline: data.timeline || null,
      software: JSON.stringify(data.software || []),
      coverImage: data.coverImage || null,
      thumbnail: data.thumbnail || null,
      images: JSON.stringify(data.images || []),
      videos: JSON.stringify(data.videos || []),
      projectUrl: data.projectUrl || null,
      featured: data.featured || false,
      published: data.published !== undefined ? data.published : true,
    },
  });

  revalidatePath('/portfolio');
  revalidatePath('/');
  revalidatePath('/admin/projects');

  return serializeProject(project);
}

export async function updateProject(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    brief: string;
    category: string;
    tags: string[];
    client: string;
    timeline: string;
    software: string[];
    coverImage: string;
    thumbnail: string;
    images: string[];
    videos: string[];
    projectUrl: string;
    featured: boolean;
    published: boolean;
    order: number;
  }>
): Promise<Project> {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.brief !== undefined) updateData.brief = data.brief;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
  if (data.client !== undefined) updateData.client = data.client;
  if (data.timeline !== undefined) updateData.timeline = data.timeline;
  if (data.software !== undefined) updateData.software = JSON.stringify(data.software);
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
  if (data.videos !== undefined) updateData.videos = JSON.stringify(data.videos);
  if (data.projectUrl !== undefined) updateData.projectUrl = data.projectUrl;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.published !== undefined) updateData.published = data.published;
  if (data.order !== undefined) updateData.order = data.order;

  const project = await db.project.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/portfolio');
  revalidatePath('/');
  revalidatePath('/admin/projects');

  return serializeProject(project);
}

export async function deleteProject(id: string): Promise<void> {
  await db.project.delete({ where: { id } });

  revalidatePath('/portfolio');
  revalidatePath('/');
  revalidatePath('/admin/projects');
}
