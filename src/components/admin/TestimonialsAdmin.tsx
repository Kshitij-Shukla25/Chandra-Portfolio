'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trash2, Plus } from 'lucide-react';
import type { Testimonial } from '@/types';
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from '@/lib/actions/testimonials';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialsAdmin({ testimonials: initial }: Props) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    content: '',
    rating: 5,
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const t = await createTestimonial(form);
    setTestimonials([...testimonials, t]);
    setModalOpen(false);
    setForm({ name: '', company: '', role: '', content: '', rating: 5, published: true });
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await deleteTestimonial(id);
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const togglePublished = async (t: Testimonial) => {
    const updated = await updateTestimonial(t.id, { published: !t.published });
    setTestimonials(testimonials.map((x) => (x.id === t.id ? updated : x)));
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={14} aria-hidden="true" />
          Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
          <p className="text-sm text-white/30">No testimonials yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-white/8 bg-white/3 flex gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white/80">{t.name}</span>
                  {t.company && (
                    <span className="text-xs text-white/30">· {t.company}</span>
                  )}
                  <div className="flex gap-0.5 ml-auto">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                  {t.content}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => togglePublished(t)}
                  className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                    t.published
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-white/8 text-white/40 hover:bg-white/12'
                  }`}
                >
                  {t.published ? 'Published' : 'Hidden'}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  aria-label={`Delete testimonial from ${t.name}`}
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Testimonial"
      >
        <form onSubmit={handleCreate} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Name *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label="Company"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/80">Rating</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={20}
                      className={n <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Textarea
            label="Content *"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={4}
            required
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="accent-white"
            />
            <span className="text-sm text-white/70">Published</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>Add Testimonial</Button>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
