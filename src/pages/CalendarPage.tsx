import { useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { WeekView } from '@/components/calendar/WeekView'
import { DayPanel } from '@/components/calendar/DayPanel'
import { TaskEditor } from '@/components/tasks/TaskEditor'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useRecordDialog } from '@/hooks/useRecordDialog'
import { useTaskActions } from '@/hooks/useTaskActions'
import { Task } from '@/types/task'
import { tasksOnDate } from '@/utils/taskSort'
import { addDays, MONTH_NAMES_AR, todayISO, toArabicDigits } from '@/utils/date'
import { cn } from '@/lib/cn'

type ViewMode = 'month' | 'week'

export function CalendarPage() {
  const { user } = useAuth()
  const { tasks } = useTasks()
  const dialog = useRecordDialog<Task>()
  const actions = useTaskActions()

  const [view, setView] = useState<ViewMode>('month')
  const [anchorDate, setAnchorDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const dayTasks = useMemo(() => tasksOnDate(tasks, selectedDate), [tasks, selectedDate])

  if (!user) return null

  const goToPreviousPeriod = () =>
    setAnchorDate((d) =>
      view === 'month' ? new Date(d.getFullYear(), d.getMonth() - 1, 1) : addDays(d, -7)
    )
  const goToNextPeriod = () =>
    setAnchorDate((d) =>
      view === 'month' ? new Date(d.getFullYear(), d.getMonth() + 1, 1) : addDays(d, 7)
    )

  return (
    <div>
      <Topbar
        title="التقويم"
        subtitle={<span>{MONTH_NAMES_AR[anchorDate.getMonth()]} {toArabicDigits(anchorDate.getFullYear())}</span>}
        actions={
          <>
            <div className="flex bg-paper-alt rounded-[10px] p-1">
              <button
                type="button"
                onClick={() => setView('month')}
                className={cn('px-3.5 py-1.5 text-[12.5px] font-semibold rounded-[9px]', view === 'month' ? 'bg-surface shadow-card' : 'text-ink-700')}
              >
                شهري
              </button>
              <button
                type="button"
                onClick={() => setView('week')}
                className={cn('px-3.5 py-1.5 text-[12.5px] font-semibold rounded-[9px]', view === 'week' ? 'bg-surface shadow-card' : 'text-ink-700')}
              >
                أسبوعي
              </button>
            </div>
            <Button variant="secondary" size="icon" onClick={goToPreviousPeriod} aria-label="السابق">
              <Icon name="chev-r" />
            </Button>
            <Button variant="secondary" size="icon" onClick={goToNextPeriod} aria-label="التالي">
              <Icon name="chev-l" />
            </Button>
            <Button onClick={dialog.openCreate}>
              <Icon name="plus" />
              إضافة مهمة
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
        {view === 'month' ? (
          <MonthGrid monthDate={anchorDate} tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        ) : (
          <WeekView weekAnchor={anchorDate} tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        )}
        <DayPanel
          dateISO={selectedDate}
          tasks={dayTasks}
          onToggleComplete={actions.toggleComplete}
          onOpen={dialog.openEdit}
        />
      </div>

      <TaskEditor dialog={dialog} actions={actions} createDefaults={{ date: selectedDate }} />
    </div>
  )
}
