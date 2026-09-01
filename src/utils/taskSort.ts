import { Task } from '@/types/task'
import { combineDateTime, isOverdue, todayISO } from './date'

const PRIORITY_RANK: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 }

function effectiveDeadline(task: Task): number {
  if (task.deadlineDate) {
    return combineDateTime(task.deadlineDate, task.deadlineTime).getTime()
  }
  return combineDateTime(task.date, task.time).getTime()
}

/**
 * Automatic ordering (no manual reordering allowed):
 * 1. Overdue first
 * 2. Priority: high > medium > low
 * 3. Nearest deadline first within each group
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const overdueA = isOverdue(a) ? 0 : 1
    const overdueB = isOverdue(b) ? 0 : 1
    if (overdueA !== overdueB) return overdueA - overdueB

    const prA = PRIORITY_RANK[a.priority]
    const prB = PRIORITY_RANK[b.priority]
    if (prA !== prB) return prA - prB

    return effectiveDeadline(a) - effectiveDeadline(b)
  })
}

export function tasksOnDate(tasks: Task[], iso: string): Task[] {
  return sortTasks(tasks.filter((t) => iso >= t.date && iso <= (t.endDate ?? t.date)))
}

export function pickMostImportantTask(tasks: Task[]): Task | null {
  const today = todayISO()
  const pending = tasks.filter((t) => t.status === 'pending')
  if (pending.length === 0) return null

  const overdue = pending.filter((t) => isOverdue(t))
  if (overdue.length > 0) {
    return sortTasks(overdue)[0]
  }

  const dueToday = pending.filter((t) => (t.deadlineDate ?? t.date) === today)
  if (dueToday.length > 0) {
    return sortTasks(dueToday)[0]
  }

  return sortTasks(pending)[0]
}
