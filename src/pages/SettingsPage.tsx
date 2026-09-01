import { FormEvent, useEffect, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { Icon } from '@/components/ui/Icon'
import { useAuth } from '@/hooks/useAuth'
import { useSettings } from '@/hooks/useSettings'
import { useTheme } from '@/hooks/useTheme'
import { useToast } from '@/components/ui/Toast'
import { changePassword, mapAuthError } from '@/services/authService'
import { saveSettings } from '@/services/settingsService'
import { Goals, NotificationSettings } from '@/types/settings'
import { cn } from '@/lib/cn'

export function SettingsPage() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const { theme, setTheme } = useTheme()
  const { showToast } = useToast()

  const [goals, setGoals] = useState<Goals>(settings.goals)
  const [notifications, setNotifications] = useState<NotificationSettings>(settings.notifications)
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => setGoals(settings.goals), [settings.goals])
  useEffect(() => setNotifications(settings.notifications), [settings.notifications])

  if (!user) return null

  const persistGoals = async (next: Goals) => {
    setGoals(next)
    await saveSettings(user.uid, { goals: next })
  }

  const persistNotifications = async (next: NotificationSettings) => {
    setNotifications(next)
    await saveSettings(user.uid, { notifications: next })
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    if (newPassword.length < 8) {
      setPasswordError('كلمة المرور يجب أن تتكون من ٨ أحرف على الأقل.')
      return
    }
    setSavingPassword(true)
    try {
      await changePassword(newPassword)
      setNewPassword('')
      showToast('تم تحديث كلمة المرور ')
    } catch (err: any) {
      setPasswordError(mapAuthError(err?.code ?? ''))
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-[720px]">
      <Topbar title="الإعدادات" />

      <Card>
        <h2 className="text-[16px] mb-4">الحساب</h2>
        <Field label="البريد الإلكتروني">
          <Input value={user.email ?? ''} disabled />
        </Field>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3.5 mt-4.5">
          <Field label="كلمة مرور جديدة">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          {passwordError && <p className="text-[12.5px] text-crit-600">{passwordError}</p>}
          <Button type="submit" variant="secondary" className="self-start" disabled={savingPassword}>
            تحديث كلمة المرور
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-[16px] mb-4">الأهداف</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="الهدف اليومي (عدد المهام)">
            <Input
              type="number"
              min={0}
              value={goals.daily}
              onChange={(e) => persistGoals({ ...goals, daily: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="الهدف الأسبوعي (عدد المهام)">
            <Input
              type="number"
              min={0}
              value={goals.weekly}
              onChange={(e) => persistGoals({ ...goals, weekly: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="الهدف الشهري (عدد المهام)">
            <Input
              type="number"
              min={0}
              value={goals.monthly}
              onChange={(e) => persistGoals({ ...goals, monthly: Number(e.target.value) || 0 })}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <h2 className="text-[16px] mb-4">الإشعارات</h2>
        <div className="flex flex-col divide-y divide-line-soft">
          <div className="flex items-center justify-between py-3.5 first:pt-0">
            <div>
              <p className="text-[13.5px] font-semibold">الملخص اليومي بالبريد الإلكتروني</p>
              <p className="text-[12px] text-ink-500 mt-0.5">ملخص بمهامك كل صباح.</p>
            </div>
            <Switch
              checked={notifications.dailyEmailEnabled}
              onChange={(v) => persistNotifications({ ...notifications, dailyEmailEnabled: v })}
              aria-label="الملخص اليومي بالبريد الإلكتروني"
            />
          </div>
          <div className={cn('flex items-center justify-between py-3.5', !notifications.dailyEmailEnabled && 'opacity-50 pointer-events-none')}>
            <p className="text-[13.5px] font-semibold">وقت الإرسال</p>
            <Input
              type="time"
              value={notifications.dailyEmailTime}
              onChange={(e) => persistNotifications({ ...notifications, dailyEmailTime: e.target.value })}
              className="w-[130px]"
            />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[13.5px] font-semibold">تنبيهات المواعيد النهائية</p>
              <p className="text-[12px] text-ink-500 mt-0.5">حسب التذكير المحدد في كل مهمة.</p>
            </div>
            <Switch
              checked={notifications.deadlineNotificationsEnabled}
              onChange={(v) => persistNotifications({ ...notifications, deadlineNotificationsEnabled: v })}
              aria-label="تنبيهات المواعيد النهائية"
            />
          </div>
          <div className="flex items-center justify-between py-3.5 last:pb-0">
            <div>
              <p className="text-[13.5px] font-semibold">الملخص الأسبوعي</p>
              <p className="text-[12px] text-ink-500 mt-0.5">ملخص إنجازك كل نهاية أسبوع.</p>
            </div>
            <Switch
              checked={notifications.weeklySummaryEnabled}
              onChange={(v) => persistNotifications({ ...notifications, weeklySummaryEnabled: v })}
              aria-label="الملخص الأسبوعي"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-[16px] mb-4">المظهر</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={cn(
              'flex-1 flex flex-col items-center gap-2 rounded-lg border p-4',
              theme === 'light' ? 'border-teal-500 ring-2 ring-teal-tint' : 'border-line'
            )}
          >
            <Icon name="sun" className="w-5 h-5 text-sand-600" />
            <span className="text-[13px] font-semibold">الوضع الفاتح</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={cn(
              'flex-1 flex flex-col items-center gap-2 rounded-lg border p-4',
              theme === 'dark' ? 'border-teal-500 ring-2 ring-teal-tint' : 'border-line'
            )}
          >
            <Icon name="moon" className="w-5 h-5 text-teal-700" />
            <span className="text-[13px] font-semibold">الوضع الداكن</span>
          </button>
        </div>
      </Card>
    </div>
  )
}
