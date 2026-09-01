export type ThemeMode = 'light' | 'dark'

export interface Goals {
  daily: number
  weekly: number
  monthly: number
}

export interface NotificationSettings {
  dailyEmailEnabled: boolean
  /** HH:mm, 24h */
  dailyEmailTime: string
  deadlineNotificationsEnabled: boolean
  weeklySummaryEnabled: boolean
}

export interface UserSettings {
  theme: ThemeMode
  goals: Goals
  notifications: NotificationSettings
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  goals: {
    daily: 5,
    weekly: 25,
    monthly: 100,
  },
  notifications: {
    dailyEmailEnabled: true,
    dailyEmailTime: '08:00',
    deadlineNotificationsEnabled: true,
    weeklySummaryEnabled: true,
  },
}
