import { useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { TaskRow } from '@/components/tasks/TaskRow'
import { TaskFormModal } from '@/components/tasks/TaskFormModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useToast } from '@/components/ui/Toast'
import { Task, NewTaskInput } from '@/types/task'
import { createTask, updateTask, completeTask, reopenTask, deleteTask } from '@/services/taskService'
import { sortTasks } from '@/utils/taskSort'
import { toArabicDigits } from '@/utils/date'

export function AllTasksPage() {
  const { user } = useAuth()
  const { tasks, loading } = useTasks()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const activeTasks = useMemo(() => {
    const pending = tasks.filter((t) => t.status === 'pending')
    const filtered = search.trim()
      ? pending.filter((t) => t.title.toLowerCase().includes(search.trim().toLowerCase()))
      : pending
    return sortTasks(filtered)
  }, [tasks, search])

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
        title="كل المهام"
        subtitle={<span>{toArabicDigits(activeTasks.length)} مهمة نشطة</span>}
        actions={
          <>
            <Input
              icon={<Icon name="search" />}
              placeholder="ابحثي عن مهمة…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[220px]"
            />
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

      <Card pad="lg">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 skeleton" />
            ))}
          </div>
        ) : activeTasks.length === 0 ? (
          <EmptyState
            message={search ? 'لا توجد نتائج مطابقة.' : 'ما عندك مهام اليوم ✨'}
            icon={<Icon name={search ? 'search' : 'check'} className="w-6 h-6" />}
          />
        ) : (
          activeTasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggleComplete={handleToggleComplete} onOpen={handleOpenTask} />
          ))
        )}
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
