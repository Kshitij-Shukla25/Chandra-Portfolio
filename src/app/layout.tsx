import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import './globals.css';
import { getSettings } from '@/lib/actions/settings';

/* Heavy condensed for the giant hero type */
const barlowCondensed = Barlow_Condensed({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  style: ['normal'],
});

/* Clean sans for body / nav */
const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.site_title,
      template: `%s | ${settings.owner_name}`,
    },
    description: settings.site_description,
    keywords: ['graphic designer', 'video editor', 'motion graphics', 'content creator', 'branding', settings.owner_name],
    authors: [{ name: settings.owner_name }],
    creator: settings.owner_name,
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      title: settings.site_title,
      description: settings.site_description,
      siteName: settings.owner_name,
      images: settings.og_image ? [{ url: settings.og_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.site_title,
      description: settings.site_description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${inter.variable} antialiased bg-[rgb(10,10,12)] text-white`}
        style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
