'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function submitContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    await db.contactSubmission.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject?.trim() || null,
        message: data.message.trim(),
      },
    });

    revalidatePath('/admin');

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function getContactSubmissions() {
  return db.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function markContactRead(id: string): Promise<void> {
  await db.contactSubmission.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath('/admin');
}
