export type NotificationCategory =
  | 'task'
  | 'campaign'
  | 'design'
  | 'content'
  | 'system'
  | 'mention';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  actorId?: string;
  link?: string;
}
