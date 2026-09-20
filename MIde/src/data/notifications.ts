import type { AppNotification, NotificationCategory, NotificationPriority } from '@/types';

const items: Array<{
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  actorId?: string;
}> = [
  {
    title: 'New task assigned',
    message: 'Yousef assigned you "Design Instagram carousel for giving drive".',
    category: 'task',
    priority: 'medium',
    actorId: 'u2',
  },
  {
    title: 'Design request approved',
    message: 'Your poster design for Open Day was approved by Amina.',
    category: 'design',
    priority: 'low',
    actorId: 'u1',
  },
  {
    title: 'Campaign budget alert',
    message: 'Ramadan Giving Drive has used 64% of its allocated budget.',
    category: 'campaign',
    priority: 'high',
  },
  {
    title: 'Content pending review',
    message: 'Lina submitted 3 new captions for review.',
    category: 'content',
    priority: 'medium',
    actorId: 'u3',
  },
  {
    title: 'You were mentioned',
    message: 'Omar mentioned you in a comment on "Edit highlight reel".',
    category: 'mention',
    priority: 'medium',
    actorId: 'u4',
  },
  {
    title: 'System maintenance',
    message: 'Scheduled maintenance this weekend from 1AM to 3AM.',
    category: 'system',
    priority: 'low',
  },
  {
    title: 'Deadline approaching',
    message: '"Video edit deadline" is due in 2 days.',
    category: 'task',
    priority: 'high',
  },
  {
    title: 'New campaign launched',
    message: 'University Open Day campaign has moved to planning stage.',
    category: 'campaign',
    priority: 'medium',
  },
];

export const notifications: AppNotification[] = Array.from({ length: 16 }).map((_, i) => {
  const item = items[i % items.length];
  return {
    id: `n${i + 1}`,
    title: item.title,
    message: item.message,
    category: item.category,
    priority: item.priority,
    read: i > 5,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 3).toISOString(),
    actorId: item.actorId,
    link: '/dashboard',
  };
});
