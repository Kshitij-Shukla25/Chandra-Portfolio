import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
];

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not supported' }, { status: 400 });
    }

    // 100 MB limit
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 });
    }

    // Sanitise filename
    const ext = file.name.split('.').pop() ?? '';
    const base = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .slice(0, 60);
    const filename = `${folder}/${base}-${Date.now()}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });

    // Determine media type
    let type: 'image' | 'video' | 'pdf' | 'gif' = 'image';
    if (file.type.startsWith('video/')) type = 'video';
    else if (file.type === 'application/pdf') type = 'pdf';
    else if (file.type === 'image/gif') type = 'gif';

    // Save record to DB
    const media = await db.media.create({
      data: {
        filename: file.name,
        url: blob.url,
        type,
        size: file.size,
        mimeType: file.type,
        folder,
      },
    });

    return NextResponse.json({ success: true, url: blob.url, media });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder');
  const type = searchParams.get('type');

  const where: Record<string, string> = {};
  if (folder) where.folder = folder;
  if (type) where.type = type;

  const media = await db.media.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ media });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  }

  const media = await db.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Delete from Vercel Blob
  try {
    await del(media.url);
  } catch {
    // File may already be deleted — continue
  }

  await db.media.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
