export type TaskPriority = 'high' | 'medium' | 'low'
export type ReminderOption = 'none' | '1h' | '12h' | '1d'

export interface TaskDoc {
  title: string
  type: 'study' | 'work' | 'project' | 'personal' | 'general'
  priority: TaskPriority
  status: 'pending' | 'completed'
  date: string
  endDate: string | null
  deadlineDate: string | null
  deadlineTime: string | null
  reminder: ReminderOption
  completedAt: number | null
  reminderSentAt?: number | null
}

export interface NotificationSettings {
  dailyEmailEnabled: boolean
  dailyEmailTime: string
  deadlineNotificationsEnabled: boolean
  weeklySummaryEnabled: boolean
}

export interface UserSettingsDoc {
  notifications: NotificationSettings
  lastDailyEmailSentDate?: string
  lastWeeklySummarySentDate?: string
}

export const TASK_PRIORITY_LABELS_AR: Record<TaskPriority, string> = {
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة',
}
