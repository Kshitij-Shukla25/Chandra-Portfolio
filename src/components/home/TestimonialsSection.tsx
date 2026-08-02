import type { Testimonial } from '@/types';
import { Star } from 'lucide-react';

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 border-t border-white/8" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-[1400px] px-6">
        <p className="text-[11px] tracking-[0.2em] text-white/30 uppercase mb-3"
           style={{ fontFamily: 'var(--font-body)' }}>
          Kind Words
        </p>
        <h2
          id="testimonials-heading"
          className="font-black uppercase leading-none text-white mb-12"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4.5vw,60px)' }}
        >
          Client Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col p-6 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'} aria-hidden="true" />
                ))}
              </div>
              <blockquote className="text-sm text-white/60 leading-relaxed flex-1 mb-5"
                          style={{ fontFamily: 'var(--font-body)' }}>
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50 shrink-0"
                     style={{ fontFamily: 'var(--font-body)' }}>
                  {t.name[0]}
                </div>
                <div>
                  <cite className="not-italic text-xs font-semibold text-white/75 block tracking-wide uppercase"
                        style={{ fontFamily: 'var(--font-body)' }}>
                    {t.name}
                  </cite>
                  {(t.role || t.company) && (
                    <span className="text-[11px] text-white/30"
                          style={{ fontFamily: 'var(--font-body)' }}>
                      {[t.role, t.company].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
