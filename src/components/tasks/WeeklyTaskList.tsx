import { Task } from '@/types/task'
import { TaskRow } from './TaskRow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { sortTasks } from '@/utils/taskSort'
import { addDays, startOfWeekSat, toISODate, WEEKDAY_NAMES_AR } from '@/utils/date'

interface WeeklyTaskListProps {
  tasks: Task[]
  onToggleComplete: (task: Task) => void
  onOpen: (task: Task) => void
}

export function WeeklyTaskList({ tasks, onToggleComplete, onOpen }: WeeklyTaskListProps) {
  const weekStart = startOfWeekSat(new Date())
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const groups = days
    .map((day) => {
      const iso = toISODate(day)
      const dayTasks = sortTasks(
        tasks.filter((t) => {
          const start = t.date
          const end = t.endDate ?? t.date
          return iso >= start && iso <= end
        })
      )
      return { iso, weekday: WEEKDAY_NAMES_AR[day.getDay()], dayTasks }
    })
    .filter((g) => g.dayTasks.length > 0)

  if (groups.length === 0) {
    return <EmptyState message="ما عندك مهام هذا الأسبوع " icon={<Icon name="cal-days" className="w-6 h-6" />} />
  }

  return (
    <div className="flex flex-col gap-4.5">
      {groups.map((g) => (
        <div key={g.iso}>
          <p className="text-[12px] font-bold text-teal-700 mb-1.5">{g.weekday}</p>
          {g.dayTasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggleComplete={onToggleComplete} onOpen={onOpen} />
          ))}
        </div>
      ))}
    </div>
  )
}
