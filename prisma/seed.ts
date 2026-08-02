import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin@123',
    12
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@portfolio.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: hashedPassword,
      name: 'Chandra Mani Mishra',
      role: 'admin',
    },
  });

  // Seed site settings
  const defaultSettings = [
    { key: 'site_title', value: 'Chandra Mani Mishra — Portfolio' },
    { key: 'site_description', value: 'Graphic Designer · Video Editor · Content Creator — 5+ years turning briefs into ad videos, reels, motion graphics and brand visuals for 50+ brands.' },
    { key: 'owner_name', value: 'Chandra Mani Mishra' },
    { key: 'owner_title', value: 'Graphic Designer · Video Editor · Content Creator' },
    { key: 'owner_bio', value: 'Results-driven creative professional with 5+ years of experience in video editing, graphic design and UI/UX design. Specialised in ad videos, reels, social media content, brand identity design and Figma-based website design.' },
    { key: 'owner_email', value: 'chandramani.dsgn@gmail.com' },
    { key: 'owner_phone', value: '+91 9560809189' },
    { key: 'owner_location', value: 'Gurugram, Haryana, India' },
    { key: 'social_instagram', value: 'https://instagram.com' },
    { key: 'social_linkedin', value: 'https://linkedin.com' },
    { key: 'social_canva', value: 'https://canva.com' },
    { key: 'stats_creatives', value: '1000+' },
    { key: 'stats_videos', value: '300+' },
    { key: 'stats_brands', value: '50+' },
    { key: 'stats_years', value: '5+' },
    { key: 'hero_tagline', value: 'Turning briefs into visuals that stop the scroll.' },
    { key: 'resume_url', value: '' },
    { key: 'og_image', value: '' },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Seed sample testimonials
  const testimonials = [
    {
      name: 'Rahul Sharma',
      company: 'TechVision India',
      role: 'Marketing Head',
      content: 'Chandra transformed our brand visuals completely. The reels he created drove a 3x increase in engagement within the first month.',
      rating: 5,
      published: true,
      order: 1,
    },
    {
      name: 'Priya Mehta',
      company: 'Elaris Consulting',
      role: 'CEO',
      content: 'Working with Chandra has been exceptional. His eye for detail and understanding of brand identity is second to none.',
      rating: 5,
      published: true,
      order: 2,
    },
    {
      name: 'Arjun Kapoor',
      company: 'DGB Training',
      role: 'Founder',
      content: 'Over 300+ videos produced for us — consistent quality, on-time delivery, and always ahead of trends.',
      rating: 5,
      published: true,
      order: 3,
    },
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: testimonial.name },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial });
    }
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
