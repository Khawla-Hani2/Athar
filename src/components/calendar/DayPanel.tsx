import { Task } from '@/types/task'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { TaskRow } from '@/components/tasks/TaskRow'
import { fromISODate, formatArabicDate, toArabicDigits } from '@/utils/date'

interface DayPanelProps {
  dateISO: string
  tasks: Task[]
  onToggleComplete: (task: Task) => void
  onOpen: (task: Task) => void
}

export function DayPanel({ dateISO, tasks, onToggleComplete, onOpen }: DayPanelProps) {
  return (
    <Card>
      <p className="text-[12px] font-bold text-teal-700 mb-1">{formatArabicDate(fromISODate(dateISO))}</p>
      <p className="text-[11.5px] text-ink-500 mb-3.5">
        {tasks.length === 0 ? 'لا توجد مهام في هذا اليوم' : `${toArabicDigits(tasks.length)} مهمة في هذا اليوم`}
      </p>
      {tasks.length === 0 ? (
        <EmptyState message="ما عندك مهام في هذا اليوم ✨" icon={<Icon name="cal" className="w-6 h-6" />} compact />
      ) : (
        tasks.map((task) => (
          <TaskRow key={task.id} task={task} onToggleComplete={onToggleComplete} onOpen={onOpen} />
        ))
      )}
    </Card>
  )
}
