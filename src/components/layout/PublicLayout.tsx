import Navbar from './Navbar';
import Footer from './Footer';
import { getSettings } from '@/lib/actions/settings';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(10,10,12)]">
      <Navbar ownerName={settings.owner_name} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
