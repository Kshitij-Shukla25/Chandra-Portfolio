'use client';

import { useState } from 'react';
import { submitContact } from '@/lib/actions/contact';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await submitContact(form);

    if (result.success) {
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border border-white/8 bg-white/3 text-center min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle size={22} className="text-green-400" aria-hidden="true" />
        </div>
        <h2 className="text-base font-medium text-white">Message sent!</h2>
        <p className="text-sm text-white/40 max-w-xs">
          Thanks for reaching out. I&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs text-white/40 hover:text-white underline underline-offset-4 transition-colors mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
      aria-label="Contact form"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Name"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
          autoComplete="email"
        />
      </div>

      <Input
        label="Subject"
        placeholder="What's this about?"
        value={form.subject}
        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
      />

      <Textarea
        label="Message"
        placeholder="Tell me about your project, timeline, and what you need…"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        required
        rows={6}
      />

      {error && (
        <p role="alert" className="text-xs text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
