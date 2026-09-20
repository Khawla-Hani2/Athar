import { useState } from 'react';
import { Moon, Sun, Monitor, Globe, Bell, Users, Palette, User } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

const TABS = [
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'team', label: 'Team Settings', icon: Users },
  { key: 'brand', label: 'Brand Settings', icon: Palette },
  { key: 'profile', label: 'Profile Settings', icon: User },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const TOGGLE_ITEMS = [
  { key: 'taskAssigned', label: 'Task assigned to me' },
  { key: 'mentions', label: 'Mentions & comments' },
  { key: 'campaignUpdates', label: 'Campaign status updates' },
  { key: 'weeklyDigest', label: 'Weekly digest email' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('appearance');
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [language, setLanguage] = useState('en');
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    taskAssigned: true,
    mentions: true,
    campaignUpdates: false,
    weeklyDigest: true,
  });

  return (
    <div>
      <PageHeader title="Settings" description="Manage your workspace preferences and configuration." />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                tab === t.key
                  ? 'bg-brand-500/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
              )}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </div>

        <div>
          {tab === 'appearance' && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { key: 'light', label: 'Light', icon: Sun },
                    { key: 'dark', label: 'Dark', icon: Moon },
                    { key: 'system', label: 'System', icon: Monitor },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setTheme(opt.key === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : opt.key)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition',
                      theme === opt.key
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                        : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400',
                    )}
                  >
                    <opt.icon className="size-5" />
                    {opt.label}
                  </button>
                ))}
              </div>

              <h3 className="mb-3 mt-8 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <Globe className="size-4" /> Language
              </h3>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { label: 'English', value: 'en' },
                  { label: 'العربية (Arabic)', value: 'ar' },
                ]}
                className="max-w-xs"
              />
            </Card>
          )}

          {tab === 'notifications' && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Notification Preferences</h3>
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                {TOGGLE_ITEMS.map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                    <Toggle
                      checked={toggles[item.key]}
                      onChange={(v) => setToggles((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'team' && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Team Settings</h3>
              <div className="flex flex-col gap-4">
                <Input label="Team / Organization Name" defaultValue="Capsule Media Team" />
                <Input label="Default Timezone" defaultValue="GMT+3 (Amman)" />
                <Button className="self-start">Save Changes</Button>
              </div>
            </Card>
          )}

          {tab === 'brand' && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Brand Settings</h3>
              <div className="flex flex-col gap-4">
                <Input label="Primary Brand Color" defaultValue="#7c3aed" />
                <Input label="Organization Website" defaultValue="https://capsulemedia.io" />
                <Button className="self-start">Save Changes</Button>
              </div>
            </Card>
          )}

          {tab === 'profile' && user && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Profile Settings</h3>
              <div className="flex flex-col gap-4">
                <Input label="Full Name" defaultValue={user.name} />
                <Input label="Email" defaultValue={user.email} type="email" />
                <Input label="Phone" defaultValue={user.phone} />
                <Button className="self-start">Save Changes</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
