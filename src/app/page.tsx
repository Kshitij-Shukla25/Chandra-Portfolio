import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/home/HeroSection';
import Ticker from '@/components/home/Ticker';
import FeaturedWork from '@/components/home/FeaturedWork';
import ExpertiseSection from '@/components/home/ExpertiseSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import { getSettings } from '@/lib/actions/settings';
import { getFeaturedProjects } from '@/lib/actions/projects';
import { getTestimonials } from '@/lib/actions/testimonials';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, projects, testimonials] = await Promise.all([
    getSettings(),
    getFeaturedProjects(),
    getTestimonials(),
  ]);

  return (
    <PublicLayout>
      <HeroSection settings={settings} />
      <Ticker />
      <FeaturedWork projects={projects} />
      <ExpertiseSection />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection settings={settings} />
    </PublicLayout>
  );
}
