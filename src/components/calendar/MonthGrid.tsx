import { Task } from '@/types/task'
import { TYPE_DOT_VAR } from '@/utils/taskVisuals'
import { addDays, startOfMonth, endOfMonth, startOfWeekSat, endOfWeekSat, toISODate, todayISO, toArabicDigits, WEEK_HEADER_AR } from '@/utils/date'
import { isOverdue } from '@/utils/date'
import { cn } from '@/lib/cn'

interface MonthGridProps {
  monthDate: Date
  tasks: Task[]
  selectedDate: string
  onSelectDate: (iso: string) => void
}

export function MonthGrid({ monthDate, tasks, selectedDate, onSelectDate }: MonthGridProps) {
  const gridStart = startOfWeekSat(startOfMonth(monthDate))
  const gridEnd = endOfWeekSat(endOfMonth(monthDate))
  const days: Date[] = []
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d)

  const today = todayISO()
  const currentMonth = monthDate.getMonth()

  const tasksByDay = new Map<string, Task[]>()
  for (const t of tasks) {
    const start = t.date
    const end = t.endDate ?? t.date
    for (let d = new Date(start); toISODate(d) <= end; d = addDays(d, 1)) {
      const iso = toISODate(d)
      if (!tasksByDay.has(iso)) tasksByDay.set(iso, [])
      tasksByDay.get(iso)!.push(t)
    }
  }

  return (
    <div className="bg-surface border border-line rounded-lg p-6 lattice-bg">
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEK_HEADER_AR.map((w) => (
          <span key={w} className="text-center text-[11px] font-bold text-ink-500">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const iso = toISODate(day)
          const inMonth = day.getMonth() === currentMonth
          const isToday = iso === today
          const isSelected = iso === selectedDate
          const dayTasks = tasksByDay.get(iso) ?? []
          const hasOverdue = dayTasks.some((t) => isOverdue(t))
          const dotTypes = [...new Set(dayTasks.slice(0, 3).map((t) => t.type))]

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className={cn(
                'aspect-square rounded-[10px] border flex flex-col items-end p-1.5 text-[12px] font-semibold transition-colors',
                !inMonth && 'text-ink-300 border-line-soft bg-surface',
                inMonth && !isToday && !isSelected && 'border-line bg-surface text-ink-900',
                isToday && 'bg-teal-700 border-teal-700 text-white shadow-pop',
                isSelected && !isToday && 'border-teal-500 ring-2 ring-teal-tint bg-surface',
                isSelected && isToday && 'ring-2 ring-offset-2 ring-offset-surface ring-sand-500',
                hasOverdue && inMonth && !isToday && 'bg-crit-tint border-crit-600 text-crit-700'
              )}
            >
              {toArabicDigits(day.getDate())}
              {dotTypes.length > 0 && (
                <span className="flex gap-0.5 mt-auto">
                  {dotTypes.map((t, i) => (
                    <i
                      key={i}
                      className="w-[5px] h-[5px] rounded-full"
                      style={{ background: isToday ? '#fff' : TYPE_DOT_VAR[t] }}
                    />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
