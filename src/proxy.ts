import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin/* routes — login is now at /(auth)/admin/login
  // so it has its own route group and doesn't hit this matcher
  if (pathname.startsWith('/admin')) {
    const session = await auth();
    if (!session?.user) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/((?!login$).*)',
  ],
};
