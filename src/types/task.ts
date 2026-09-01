export type TaskType = 'study' | 'work' | 'project' | 'personal' | 'general'
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'pending' | 'completed'
export type ReminderOption = 'none' | '1h' | '12h' | '1d'

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Task {
  id: string
  userId: string
  title: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  notes: string
  links: string[]
  subtasks: Subtask[]
  /** yyyy-MM-dd */
  date: string
  /** HH:mm, optional */
  time: string | null
  /** yyyy-MM-dd, optional end date for multi-day tasks */
  endDate: string | null
  /** yyyy-MM-dd deadline date */
  deadlineDate: string | null
  /** HH:mm deadline time, optional */
  deadlineTime: string | null
  reminder: ReminderOption
  createdAt: number
  completedAt: number | null
}

export type NewTaskInput = Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedAt' | 'status'>

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  study: 'دراسة',
  work: 'عمل',
  project: 'مشروع',
  personal: 'شخصي',
  general: 'عام',
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة',
}

export const REMINDER_LABELS: Record<ReminderOption, string> = {
  none: 'بدون تذكير',
  '1h': 'قبل ساعة',
  '12h': 'قبل 12 ساعة',
  '1d': 'قبل يوم',
}
