import { Task } from '@/types/task'
import { addDays, startOfWeekSat, toISODate, todayISO, toArabicDigits, WEEKDAY_NAMES_AR } from '@/utils/date'
import { tasksOnDate } from '@/utils/taskSort'
import { TYPE_DOT_VAR } from '@/utils/taskVisuals'
import { cn } from '@/lib/cn'

interface WeekViewProps {
  weekAnchor: Date
  tasks: Task[]
  selectedDate: string
  onSelectDate: (iso: string) => void
}

export function WeekView({ weekAnchor, tasks, selectedDate, onSelectDate }: WeekViewProps) {
  const start = startOfWeekSat(weekAnchor)
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const today = todayISO()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5">
      {days.map((day) => {
        const iso = toISODate(day)
        const dayTasks = tasksOnDate(tasks, iso)
        const isToday = iso === today
        const isSelected = iso === selectedDate

        return (
          <button
            key={iso}
            type="button"
            onClick={() => onSelectDate(iso)}
            className={cn(
              'text-start bg-surface border rounded-lg p-3 flex sm:flex-col gap-2 sm:min-h-[120px]',
              isSelected ? 'border-teal-500 ring-2 ring-teal-tint' : 'border-line',
              isToday && !isSelected && 'border-teal-600'
            )}
          >
            <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0.5 shrink-0">
              <span className="text-[11px] font-bold text-ink-500">{WEEKDAY_NAMES_AR[day.getDay()]}</span>
              <span className={cn('text-[13px] font-bold', isToday && 'text-teal-700')}>
                {toArabicDigits(day.getDate())}
              </span>
            </div>
            <div className="flex-1 flex flex-wrap sm:flex-col gap-1">
              {dayTasks.slice(0, 4).map((t) => (
                <span key={t.id} className="hidden sm:flex items-center gap-1.5 text-[11px] text-ink-700 truncate">
                  <i className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TYPE_DOT_VAR[t.type] }} />
                  <span className="truncate">{t.title}</span>
                </span>
              ))}
              {dayTasks.length > 0 && (
                <span className="sm:hidden flex gap-1">
                  {dayTasks.slice(0, 5).map((t) => (
                    <i key={t.id} className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_DOT_VAR[t.type] }} />
                  ))}
                </span>
              )}
              {dayTasks.length === 0 && <span className="hidden sm:block text-[11px] text-ink-300">—</span>}
            </div>
          </button>
        )
      })}
    </div>
  )
}
