import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const display = { fontFamily: 'var(--font-display)' };
const body = { fontFamily: 'var(--font-body)' };

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[rgb(10,10,12)]">
      <div className="hero-glow fixed inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative text-center">
        <h1
          className="font-black uppercase leading-none text-outline select-none"
          style={{ ...display, fontSize: 'clamp(100px, 20vw, 260px)' }}
          aria-hidden="true"
        >
          404
        </h1>
        <p className="text-lg font-black uppercase text-white mt-2 mb-3"
           style={display}>
          Page Not Found
        </p>
        <p className="text-sm text-white/35 mb-8 max-w-xs mx-auto" style={body}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-6 border border-white/15 text-white/60 text-sm uppercase tracking-widest rounded-lg hover:border-white/30 hover:text-white transition-colors"
          style={body}
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
