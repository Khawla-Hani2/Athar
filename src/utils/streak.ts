import { Task } from '@/types/task'
import { StreakData } from '@/types/stats'
import { addDays, toISODate, todayISO } from './date'

/**
 * A day "counts" toward the streak when the number of tasks completed on that
 * day meets the user's daily goal (or at least 1 completed task if the goal is 0).
 */
export function computeStreak(tasks: Task[], dailyGoal: number): StreakData {
  const completedCountByDay = new Map<string, number>()
  for (const task of tasks) {
    if (task.status !== 'completed' || !task.completedAt) continue
    const day = toISODate(new Date(task.completedAt))
    completedCountByDay.set(day, (completedCountByDay.get(day) ?? 0) + 1)
  }

  const goal = Math.max(dailyGoal, 1)
  const qualifyingDays = new Set(
    [...completedCountByDay.entries()].filter(([, count]) => count >= goal).map(([day]) => day)
  )

  if (qualifyingDays.size === 0) {
    return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null }
  }

  const sortedDays = [...qualifyingDays].sort()

  let longest = 1
  let run = 1
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1])
    const expectedNext = toISODate(addDays(prev, 1))
    if (sortedDays[i] === expectedNext) {
      run += 1
    } else {
      run = 1
    }
    longest = Math.max(longest, run)
  }

  const today = todayISO()
  const yesterday = toISODate(addDays(new Date(), -1))
  let current = 0
  let cursor = qualifyingDays.has(today) ? today : qualifyingDays.has(yesterday) ? yesterday : null
  if (cursor) {
    while (qualifyingDays.has(cursor)) {
      current += 1
      cursor = toISODate(addDays(new Date(cursor), -1))
    }
  }

  return {
    currentStreak: current,
    longestStreak: longest,
    lastCompletedDate: sortedDays[sortedDays.length - 1],
  }
}
