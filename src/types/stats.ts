export interface MonthlyHistoryEntry {
  /** yyyy-MM */
  month: string
  percentage: number
  completedCount: number
  totalCount: number
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  /** yyyy-MM-dd of the last day counted toward the streak */
  lastCompletedDate: string | null
}
