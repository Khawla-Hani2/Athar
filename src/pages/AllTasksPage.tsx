import { useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { TaskRow } from '@/components/tasks/TaskRow'
import { TaskEditor } from '@/components/tasks/TaskEditor'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useRecordDialog } from '@/hooks/useRecordDialog'
import { useTaskActions } from '@/hooks/useTaskActions'
import { Task } from '@/types/task'
import { sortTasks } from '@/utils/taskSort'
import { toArabicDigits } from '@/utils/date'

export function AllTasksPage() {
  const { user } = useAuth()
  const { tasks, loading } = useTasks()
  const dialog = useRecordDialog<Task>()
  const actions = useTaskActions()

  const [search, setSearch] = useState('')

  const activeTasks = useMemo(() => {
    const pending = tasks.filter((t) => t.status === 'pending')
    const term = search.trim().toLowerCase()
    const filtered = term ? pending.filter((t) => t.title.toLowerCase().includes(term)) : pending
    return sortTasks(filtered)
  }, [tasks, search])

  if (!user) return null

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
            <Button onClick={dialog.openCreate}>
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
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : activeTasks.length === 0 ? (
          <EmptyState
            message={search ? 'لا توجد نتائج مطابقة.' : 'ما عندك مهام اليوم '}
            icon={<Icon name={search ? 'search' : 'check'} className="w-6 h-6" />}
          />
        ) : (
          activeTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggleComplete={actions.toggleComplete}
              onOpen={dialog.openEdit}
            />
          ))
        )}
      </Card>

      <TaskEditor dialog={dialog} actions={actions} />
    </div>
  )
}
