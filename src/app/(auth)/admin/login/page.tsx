'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const body = { fontFamily: 'var(--font-body)' };
const display = { fontFamily: 'var(--font-display)' };

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[rgb(10,10,12)]">
      {/* Background glow */}
      <div className="hero-glow fixed inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1
            className="font-black uppercase leading-none text-white"
            style={{ ...display, fontSize: 'clamp(28px, 5vw, 48px)' }}
          >
            Admin
          </h1>
          <p className="text-[11px] text-white/30 mt-2 tracking-widest uppercase" style={body}>
            Portfolio Management
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-xl border border-white/10 bg-white/[0.03]"
          noValidate
        >
          <Input
            label="Email"
            type="email"
            placeholder="admin@portfolio.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            autoComplete="current-password"
          />

          {error && (
            <p role="alert" className="text-xs text-red-400 p-2.5 bg-red-500/10 rounded-lg border border-red-500/15" style={body}>
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <p className="text-center text-[11px] text-white/20 mt-4" style={body}>
          ← <a href="/" className="hover:text-white/50 transition-colors">Back to site</a>
        </p>
      </div>
    </div>
  );
}
