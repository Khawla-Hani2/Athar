import { Task, TaskType } from '@/types/task'
import {
  endOfMonth,
  endOfWeekSat,
  startOfMonth,
  startOfWeekSat,
  toISODate,
} from './date'

export interface CompletionStats {
  completed: number
  total: number
  percentage: number
}

/**
 * How much of a task's available time (from creation to deadline) has elapsed —
 * used purely for the nearest-deadline urgency ring, not for completion math.
 */
export function computeUrgencyPercentage(createdAt: number, deadline: Date, now: Date = new Date()): number {
  const total = deadline.getTime() - createdAt
  if (total <= 0) return 100
  const elapsed = now.getTime() - createdAt
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)))
}

function taskOverlapsRange(task: Task, startISO: string, endISO: string): boolean {
  const taskStart = task.date
  const taskEnd = task.endDate ?? task.date
  return taskStart <= endISO && taskEnd >= startISO
}

export function computeCompletion(tasks: Task[], startISO: string, endISO: string): CompletionStats {
  const inRange = tasks.filter((t) => taskOverlapsRange(t, startISO, endISO))
  const completed = inRange.filter((t) => t.status === 'completed').length
  const total = inRange.length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { completed, total, percentage }
}

export function getDayRange(date: Date): [string, string] {
  const iso = toISODate(date)
  return [iso, iso]
}

export function getWeekRange(date: Date): [string, string] {
  return [toISODate(startOfWeekSat(date)), toISODate(endOfWeekSat(date))]
}

export function getMonthRange(date: Date): [string, string] {
  return [toISODate(startOfMonth(date)), toISODate(endOfMonth(date))]
}

export function getPreviousWeekRange(date: Date): [string, string] {
  const prev = new Date(date)
  prev.setDate(prev.getDate() - 7)
  return getWeekRange(prev)
}

export function getPreviousMonthRange(date: Date): [string, string] {
  const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  return getMonthRange(prev)
}

export function countByType(tasks: Task[]): Record<TaskType, number> {
  const counts: Record<TaskType, number> = { study: 0, work: 0, project: 0, personal: 0, general: 0 }
  for (const t of tasks) counts[t.type] += 1
  return counts
}

export function dailyPercentagesForWeek(tasks: Task[], weekStartISO: string): number[] {
  const start = new Date(weekStartISO)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const iso = toISODate(d)
    return computeCompletion(tasks, iso, iso).percentage
  })
}

export function weeklyPercentagesForMonth(tasks: Task[], monthDate: Date): number[] {
  const [start, end] = getMonthRange(monthDate)
  const startDate = new Date(start)
  const endDate = new Date(end)
  const weeks: number[] = []
  let cursor = startOfWeekSat(startDate)
  while (cursor <= endDate) {
    const weekEndDate = endOfWeekSat(cursor)
    weeks.push(computeCompletion(tasks, toISODate(cursor), toISODate(weekEndDate)).percentage)
    cursor = new Date(cursor)
    cursor.setDate(cursor.getDate() + 7)
  }
  return weeks
}

export function countCompletedInRange(tasks: Task[], startISO: string, endISO: string): number {
  return tasks.filter(
    (t) => t.status === 'completed' && t.completedAt && toISODate(new Date(t.completedAt)) >= startISO && toISODate(new Date(t.completedAt)) <= endISO
  ).length
}
