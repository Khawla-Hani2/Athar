import { Task, TASK_TYPE_LABELS, TASK_PRIORITY_LABELS } from '@/types/task'
import { Checkbox } from '@/components/ui/Checkbox'
import { Badge, PriorityBadge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { TYPE_DOT_VAR } from '@/utils/taskVisuals'
import { combineDateTime, formatArabicTime, formatOverdueSince, isOverdue } from '@/utils/date'
import { cn } from '@/lib/cn'

interface TaskRowProps {
  task: Task
  onToggleComplete: (task: Task) => void
  onOpen: (task: Task) => void
}

export function TaskRow({ task, onToggleComplete, onOpen }: TaskRowProps) {
  const overdue = isOverdue(task)
  const done = task.status === 'completed'

  return (
    <div
      className={cn(
        'flex items-start gap-3.5 py-3.5 border-b border-line-soft last:border-none cursor-pointer',
        overdue && 'border-s-[3px] border-s-crit-600 ps-3 -ms-px rounded-lg bg-gradient-to-l from-crit-tint to-transparent'
      )}
      onClick={() => onOpen(task)}
    >
      <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
        <Checkbox round checked={done} onChange={() => onToggleComplete(task)} aria-label="إنجاز المهمة" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-[14.5px] font-semibold text-ink-900', done && 'line-through text-ink-500 font-medium')}>
          {task.title}
        </p>
        <div className="flex items-center gap-3.5 flex-wrap mt-1.5">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-700">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_DOT_VAR[task.type] }} />
            {TASK_TYPE_LABELS[task.type]}
          </span>
          {overdue ? (
            <Badge variant="overdue">
              {formatOverdueSince(combineDateTime(task.deadlineDate!, task.deadlineTime))}
            </Badge>
          ) : (
            <PriorityBadge priority={task.priority} label={TASK_PRIORITY_LABELS[task.priority]} />
          )}
          {(task.time || task.deadlineTime) && (
            <span className="inline-flex items-center gap-1 text-[12px] text-ink-500">
              <Icon name="clock" className="w-[13px] h-[13px]" />
              {formatArabicTime(task.deadlineTime ?? task.time)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
