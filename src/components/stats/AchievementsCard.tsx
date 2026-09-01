import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { toArabicDigits } from '@/utils/date'

interface AchievementsCardProps {
  today: number
  week: number
  month: number
  longestStreak: number
}

export function AchievementsCard({ today, week, month, longestStreak }: AchievementsCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[16px]">إنجازاتي</h2>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-paper-alt rounded-xl p-3.5">
          <p className="text-[11.5px] text-ink-500">المنجزة اليوم</p>
          <p className="text-[22px] font-bold mt-1">{toArabicDigits(today)}</p>
        </div>
        <div className="bg-paper-alt rounded-xl p-3.5">
          <p className="text-[11.5px] text-ink-500">المنجزة هذا الأسبوع</p>
          <p className="text-[22px] font-bold mt-1">{toArabicDigits(week)}</p>
        </div>
        <div className="bg-paper-alt rounded-xl p-3.5">
          <p className="text-[11.5px] text-ink-500">المنجزة هذا الشهر</p>
          <p className="text-[22px] font-bold mt-1">{toArabicDigits(month)}</p>
        </div>
        <div className="bg-sand-tint rounded-xl p-3.5">
          <p className="text-[11.5px] text-sand-700 flex items-center gap-1.5">
            <Icon name="fire" className="w-3 h-3" />
            أطول سلسلة إنجاز
          </p>
          <p className="text-[22px] font-bold mt-1 text-sand-700">{toArabicDigits(longestStreak)} أيام</p>
        </div>
      </div>
    </Card>
  )
}
