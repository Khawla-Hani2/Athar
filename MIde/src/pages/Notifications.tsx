import { useMemo, useState } from 'react';
import { CheckCheck, Trash2, Bell, KanbanSquare, Megaphone, PenTool, FileText, Settings, AtSign } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotificationStore } from '@/store/notificationStore';
import { getUserById } from '@/data';
import type { NotificationCategory } from '@/types';
import { formatRelativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  task: KanbanSquare,
  campaign: Megaphone,
  design: PenTool,
  content: FileText,
  system: Settings,
  mention: AtSign,
};

const FILTERS = ['All', 'Unread', 'task', 'campaign', 'design', 'content', 'mention', 'system'] as const;

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return notifications;
    if (filter === 'Unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of tasks, mentions, and campaign updates."
        action={
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="size-4" /> Mark all as read
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition',
              filter === f
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-slate-200 text-slate-500 hover:border-brand-300 dark:border-slate-700 dark:text-slate-400',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="No notifications to show here." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((n) => {
            const Icon = CATEGORY_ICONS[n.category];
            const actor = n.actorId ? getUserById(n.actorId) : undefined;
            return (
              <Card
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={cn(
                  'flex cursor-pointer items-start gap-3 p-4 transition hover:shadow-md',
                  !n.read && 'border-brand-200 bg-brand-50/40 dark:border-brand-900 dark:bg-brand-900/10',
                )}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                    {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-brand-500" />}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{n.message}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                    <span>{formatRelativeTime(n.createdAt)}</span>
                    {actor && <span>· {actor.name}</span>}
                    <Badge color={n.priority === 'high' ? 'red' : n.priority === 'medium' ? 'blue' : 'slate'}>
                      {n.priority}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(n.id);
                  }}
                  aria-label="Delete notification"
                  className="shrink-0 rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="size-4" />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
