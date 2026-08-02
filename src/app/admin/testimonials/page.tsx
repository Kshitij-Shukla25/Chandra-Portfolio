import { getAllTestimonialsAdmin, deleteTestimonial } from '@/lib/actions/testimonials';
import TestimonialsAdmin from '@/components/admin/TestimonialsAdmin';

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Testimonials</h1>
        <p className="text-sm text-white/40 mt-1">{testimonials.length} total</p>
      </div>
      <TestimonialsAdmin testimonials={testimonials} />
    </div>
  );
}
