import { useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Card } from '@/components/ui/Card'
import { Ring } from '@/components/ui/Ring'
import { PriorityTaskCard } from '@/components/tasks/PriorityTaskCard'
import { StatCard } from '@/components/stats/StatCard'
import { AchievementsCard } from '@/components/stats/AchievementsCard'
import { GoalsCard } from '@/components/stats/GoalsCard'
import { WeeklyTaskList } from '@/components/tasks/WeeklyTaskList'
import { TaskFormModal } from '@/components/tasks/TaskFormModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useSettings } from '@/hooks/useSettings'
import { useNow } from '@/hooks/useNow'
import { useToast } from '@/components/ui/Toast'
import { Task, NewTaskInput } from '@/types/task'
import { createTask, updateTask, completeTask, reopenTask, deleteTask } from '@/services/taskService'
import { pickMostImportantTask } from '@/utils/taskSort'
import { computeCompletion, computeUrgencyPercentage, countCompletedInRange, getDayRange, getWeekRange, getMonthRange } from '@/utils/stats'
import { computeStreak } from '@/utils/streak'
import { formatArabicDate, formatClock, formatCountdown, getGreeting, combineDateTime, fromISODate } from '@/utils/date'
import { getDailyMotivationalPhrase } from '@/utils/motivationalPhrases'

export function DashboardPage() {
  const { user } = useAuth()
  const { tasks } = useTasks()
  const { settings } = useSettings()
  const now = useNow()
  const { showToast } = useToast()

  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const mostImportant = useMemo(() => pickMostImportantTask(tasks), [tasks])

  const [dayStart, dayEnd] = getDayRange(now)
  const [weekStart, weekEnd] = getWeekRange(now)
  const [monthStart, monthEnd] = getMonthRange(now)

  const dayStats = computeCompletion(tasks, dayStart, dayEnd)
  const weekStats = computeCompletion(tasks, weekStart, weekEnd)
  const monthStats = computeCompletion(tasks, monthStart, monthEnd)

  const completedToday = countCompletedInRange(tasks, dayStart, dayEnd)
  const completedWeek = countCompletedInRange(tasks, weekStart, weekEnd)
  const completedMonth = countCompletedInRange(tasks, monthStart, monthEnd)
  const streak = useMemo(() => computeStreak(tasks, settings.goals.daily), [tasks, settings.goals.daily])

  const nearestDeadlineTask = useMemo(() => {
    const withDeadline = tasks.filter((t) => t.status === 'pending' && t.deadlineDate)
    if (withDeadline.length === 0) return null
    return withDeadline.sort(
      (a, b) =>
        combineDateTime(a.deadlineDate!, a.deadlineTime).getTime() -
        combineDateTime(b.deadlineDate!, b.deadlineTime).getTime()
    )[0]
  }, [tasks])

  if (!user) return null

  const handleToggleComplete = async (task: Task) => {
    try {
      if (task.status === 'completed') {
        await reopenTask(user.uid, task.id)
      } else {
        await completeTask(user.uid, task.id)
        showToast('أحسنتِ! تم إنجاز المهمة ✨')
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
      showToast('تم حفظ التغييرات ✨')
    } else {
      await createTask(user.uid, input)
      showToast('تمت إضافة المهمة ✨')
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
        title={getGreeting(now)}
        subtitle={
          <>
            <span>{formatArabicDate(now)}</span>
            <span>·</span>
            <span>{formatClock(now)}</span>
            <span>·</span>
            <span className="text-sand-700 font-semibold">{getDailyMotivationalPhrase(now)}</span>
          </>
        }
        actions={
          <Button
            onClick={() => {
              setEditingTask(null)
              setFormOpen(true)
            }}
          >
            <Icon name="plus" />
            مهمة جديدة
          </Button>
        }
      />

      <PriorityTaskCard task={mostImportant} onComplete={handleToggleComplete} onOpen={handleOpenTask} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatCard label="إنجاز اليوم" completed={dayStats.completed} total={dayStats.total} percentage={dayStats.percentage} color="var(--teal-600)" />
        <StatCard label="إنجاز هذا الأسبوع" completed={weekStats.completed} total={weekStats.total} percentage={weekStats.percentage} color="var(--palm-700)" unit="مهمة" />
        <StatCard label="إنجاز هذا الشهر" completed={monthStats.completed} total={monthStats.total} percentage={monthStats.percentage} color="var(--sand-600)" unit="مهمة" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-5">
        <AchievementsCard today={completedToday} week={completedWeek} month={completedMonth} longestStreak={streak.longestStreak} />
        <Card className="flex flex-col items-center justify-center text-center">
          <p className="text-[12px] font-bold text-ink-500 mb-3.5">أقرب موعد نهائي</p>
          {nearestDeadlineTask ? (
            <>
              <Ring
                percentage={computeUrgencyPercentage(
                  nearestDeadlineTask.createdAt,
                  combineDateTime(nearestDeadlineTask.deadlineDate!, nearestDeadlineTask.deadlineTime),
                  now
                )}
                color="var(--crit-600)"
                size={96}
                label={formatCountdown(combineDateTime(nearestDeadlineTask.deadlineDate!, nearestDeadlineTask.deadlineTime), now)}
              />
              <p className="text-[13.5px] font-semibold mt-3.5">{nearestDeadlineTask.title}</p>
              <p className="text-[11.5px] text-ink-500 mt-1">
                {formatArabicDate(fromISODate(nearestDeadlineTask.deadlineDate!), false)}
              </p>
            </>
          ) : (
            <p className="text-[13.5px] text-ink-500 py-6">ما عندك مواعيد نهائية قريبة.</p>
          )}
        </Card>
      </div>

      <div className="mb-5">
        <GoalsCard
          dailyCompleted={completedToday}
          dailyGoal={settings.goals.daily}
          weeklyCompleted={completedWeek}
          weeklyGoal={settings.goals.weekly}
          monthlyCompleted={completedMonth}
          monthlyGoal={settings.goals.monthly}
        />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-[16px]">مهام هذا الأسبوع</h2>
        </div>
        <WeeklyTaskList tasks={tasks.filter((t) => t.status === 'pending')} onToggleComplete={handleToggleComplete} onOpen={handleOpenTask} />
      </Card>

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
