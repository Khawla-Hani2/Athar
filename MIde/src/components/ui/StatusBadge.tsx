import { Badge, type BadgeColor } from './Badge';

const STATUS_COLOR_MAP: Record<string, BadgeColor> = {
  // posts
  Draft: 'slate',
  Review: 'amber',
  Approved: 'blue',
  Scheduled: 'brand',
  Published: 'green',
  Rejected: 'red',
  // tasks
  todo: 'slate',
  'in-progress': 'blue',
  'in-review': 'amber',
  done: 'green',
  // campaigns
  planning: 'slate',
  active: 'green',
  paused: 'amber',
  completed: 'brand',
  // design requests
  pending: 'slate',
  // content requests
  new: 'slate',
  submitted: 'blue',
  // priority
  low: 'slate',
  medium: 'blue',
  high: 'amber',
  urgent: 'red',
};

const LABEL_MAP: Record<string, string> = {
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  todo: 'To Do',
  done: 'Done',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = STATUS_COLOR_MAP[status] ?? 'slate';
  const label = LABEL_MAP[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <Badge color={color} className={className}>
      {label}
    </Badge>
  );
}
