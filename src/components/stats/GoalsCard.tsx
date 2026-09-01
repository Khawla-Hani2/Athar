import { Card } from '@/components/ui/Card'
import { toArabicDigits } from '@/utils/date'

interface GoalRowProps {
  label: string
  completed: number
  goal: number
}

function GoalRow({ label, completed, goal }: GoalRowProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((completed / goal) * 100)) : 0
  const reached = goal > 0 && completed >= goal

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12.5px] font-semibold text-ink-700">{label}</span>
        <span className="text-[12px] text-ink-500">
          {toArabicDigits(completed)} / {toArabicDigits(goal)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-line-soft overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: reached ? 'var(--success-600)' : 'var(--teal-600)' }}
        />
      </div>
    </div>
  )
}

interface GoalsCardProps {
  dailyCompleted: number
  dailyGoal: number
  weeklyCompleted: number
  weeklyGoal: number
  monthlyCompleted: number
  monthlyGoal: number
}

export function GoalsCard({
  dailyCompleted,
  dailyGoal,
  weeklyCompleted,
  weeklyGoal,
  monthlyCompleted,
  monthlyGoal,
}: GoalsCardProps) {
  return (
    <Card>
      <h2 className="text-[16px] mb-4">أهدافي</h2>
      <div className="flex flex-col gap-4">
        <GoalRow label="الهدف اليومي" completed={dailyCompleted} goal={dailyGoal} />
        <GoalRow label="الهدف الأسبوعي" completed={weeklyCompleted} goal={weeklyGoal} />
        <GoalRow label="الهدف الشهري" completed={monthlyCompleted} goal={monthlyGoal} />
      </div>
    </Card>
  )
}
