import { useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { WeekView } from '@/components/calendar/WeekView'
import { DayPanel } from '@/components/calendar/DayPanel'
import { TaskFormModal } from '@/components/tasks/TaskFormModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useToast } from '@/components/ui/Toast'
import { Task, NewTaskInput } from '@/types/task'
import { createTask, updateTask, completeTask, reopenTask, deleteTask } from '@/services/taskService'
import { tasksOnDate } from '@/utils/taskSort'
import { addDays, MONTH_NAMES_AR, todayISO, toArabicDigits } from '@/utils/date'
import { cn } from '@/lib/cn'

type ViewMode = 'month' | 'week'

export function CalendarPage() {
  const { user } = useAuth()
  const { tasks } = useTasks()
  const { showToast } = useToast()

  const [view, setView] = useState<ViewMode>('month')
  const [anchorDate, setAnchorDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const dayTasks = useMemo(() => tasksOnDate(tasks, selectedDate), [tasks, selectedDate])

  if (!user) return null

  const goPrev = () => setAnchorDate((d) => (view === 'month' ? new Date(d.getFullYear(), d.getMonth() - 1, 1) : addDays(d, -7)))
  const goNext = () => setAnchorDate((d) => (view === 'month' ? new Date(d.getFullYear(), d.getMonth() + 1, 1) : addDays(d, 7)))

  const handleToggleComplete = async (task: Task) => {
    try {
      if (task.status === 'completed') {
        await reopenTask(user.uid, task.id)
      } else {
        await completeTask(user.uid, task.id)
        showToast('أحسنتِ! تم إنجاز المهمة ')
      }
    } catch {
      showToast('تعذّر تحديث المهمة، حاولي مرة أخرى.', 'error')
    }
  }

  const handleOpenTask = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleSubmitTask = async (input: NewTaskInput) => {
    if (editingTask) {
      await updateTask(user.uid, editingTask.id, input)
      showToast('تم حفظ التغييرات ')
    } else {
      await createTask(user.uid, { ...input, date: selectedDate })
      showToast('تمت إضافة المهمة ')
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!deletingTask) return
    try {
      await deleteTask(user.uid, deletingTask.id)
      showToast('تم حذف المهمة')
    } catch {
      showToast('تعذّر حذف المهمة.', 'error')
    } finally {
      setDeletingTask(null)
      setFormOpen(false)
    }
  }

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
            <Button variant="secondary" size="icon" onClick={goPrev} aria-label="السابق">
              <Icon name="chev-r" />
            </Button>
            <Button variant="secondary" size="icon" onClick={goNext} aria-label="التالي">
              <Icon name="chev-l" />
            </Button>
            <Button
              onClick={() => {
                setEditingTask(null)
                setFormOpen(true)
              }}
            >
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
        <DayPanel dateISO={selectedDate} tasks={dayTasks} onToggleComplete={handleToggleComplete} onOpen={handleOpenTask} />
      </div>

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitTask}
        task={editingTask}
        onDelete={editingTask ? () => setDeletingTask(editingTask) : undefined}
      />

      <ConfirmDialog
        open={Boolean(deletingTask)}
        title="هل أنتِ متأكدة من حذف هذه المهمة؟"
        description={deletingTask ? `"${deletingTask.title}" — لا يمكن التراجع عن هذا الإجراء.` : undefined}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  )
}
