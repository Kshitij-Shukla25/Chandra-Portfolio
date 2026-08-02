import { getSettings } from '@/lib/actions/settings';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage site content and information</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
