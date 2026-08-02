'use server';

import { db } from '@/lib/db';
import type { Testimonial } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getTestimonials(): Promise<Testimonial[]> {
  return db.testimonial.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  return db.testimonial.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function createTestimonial(data: {
  name: string;
  company?: string;
  role?: string;
  content: string;
  rating?: number;
  avatar?: string;
  published?: boolean;
}): Promise<Testimonial> {
  const t = await db.testimonial.create({
    data: {
      name: data.name,
      company: data.company || null,
      role: data.role || null,
      content: data.content,
      rating: data.rating || 5,
      avatar: data.avatar || null,
      published: data.published !== undefined ? data.published : true,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/testimonials');
  return t;
}

export async function updateTestimonial(
  id: string,
  data: Partial<{
    name: string;
    company: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
    published: boolean;
    order: number;
  }>
): Promise<Testimonial> {
  const t = await db.testimonial.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/admin/testimonials');
  return t;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await db.testimonial.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/testimonials');
}
