import { Task, TASK_PRIORITY_LABELS } from '@/types/task'
import { Icon } from '@/components/ui/Icon'
import { combineDateTime, formatArabicTime, formatCountdown, isOverdue, todayISO } from '@/utils/date'
import { useNow } from '@/hooks/useNow'

interface PriorityTaskCardProps {
  task: Task | null
  onComplete: (task: Task) => void
  onOpen: (task: Task) => void
}

export function PriorityTaskCard({ task, onComplete, onOpen }: PriorityTaskCardProps) {
  const now = useNow()

  if (!task) {
    return (
      <div className="relative overflow-hidden rounded-lg p-6 mb-5 bg-gradient-to-l from-teal-900 to-[#123f3b] text-paper-alt text-center">
        <p className="text-[15px]">ما عندك مهام اليوم </p>
      </div>
    )
  }

  const deadline = task.deadlineDate ? combineDateTime(task.deadlineDate, task.deadlineTime) : null
  const overdue = isOverdue(task)
  const dueToday = task.deadlineDate === todayISO() || (!task.deadlineDate && task.date === todayISO())

  let timeLabel = ''
  if (deadline) {
    timeLabel = dueToday
      ? `الموعد النهائي اليوم، ${formatArabicTime(task.deadlineTime)}`
      : `الموعد النهائي ${task.deadlineDate}${task.deadlineTime ? '، ' + formatArabicTime(task.deadlineTime) : ''}`
  } else if (task.time) {
    timeLabel = `اليوم، ${formatArabicTime(task.time)}`
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg p-6 mb-5 bg-gradient-to-l from-teal-900 to-[#123f3b] text-paper-alt cursor-pointer"
      onClick={() => onOpen(task)}
    >
      <Icon
        name="athar"
        className="absolute w-[150px] h-[150px] opacity-[0.06] -top-5 -end-5 text-paper"
      />
      <div className="flex justify-between items-start gap-5 flex-wrap relative">
        <div className="flex-1 min-w-[220px]">
          <p className="text-[11.5px] font-bold tracking-wide text-sand-500 uppercase">مهمتك الأهم اليوم</p>
          <h2 className="text-[20px] sm:text-[22px] text-paper mt-2.5">{task.title}</h2>
          <div className="flex gap-4 mt-4 flex-wrap items-center">
            <span
              className="inline-flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(226,131,108,.18)', color: '#F0A98F' }}
            >
              <Icon name="flag" className="w-[11px] h-[11px]" />
              أولوية {TASK_PRIORITY_LABELS[task.priority]}
            </span>
            {timeLabel && (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-paper-alt/75">
                <Icon name="clock" className="w-[13px] h-[13px]" />
                {overdue ? 'متأخرة' : timeLabel}
              </span>
            )}
          </div>
        </div>
        <div className="text-center shrink-0" onClick={(e) => e.stopPropagation()}>
          <p className="text-[11px] text-paper-alt/60">الوقت المتبقي</p>
          <p className="font-body text-[26px] sm:text-[30px] font-bold text-sand-500 mt-1">
            {deadline ? formatCountdown(deadline, now) : '—'}
          </p>
          <button
            className="mt-2.5 w-full inline-flex items-center justify-center gap-2 rounded-[11px] px-4 py-2 text-[13px] font-semibold bg-sand-500 text-teal-900"
            onClick={() => onComplete(task)}
          >
            <Icon name="check" className="w-4 h-4" />
            إنجاز المهمة
          </button>
        </div>
      </div>
    </div>
  )
}
