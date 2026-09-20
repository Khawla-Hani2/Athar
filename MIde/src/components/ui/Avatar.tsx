import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  status?: 'active' | 'away' | 'offline';
  className?: string;
}

const sizeClasses = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-base',
};

const statusColors = {
  active: 'bg-emerald-500',
  away: 'bg-amber-500',
  offline: 'bg-slate-400',
};

export function Avatar({ src, name, size = 'md', status, className }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover ring-2 ring-white dark:ring-slate-900', sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ring-2 ring-white dark:bg-brand-900 dark:text-brand-200 dark:ring-slate-900',
            sizeClasses[size],
          )}
        >
          {initials(name)}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block size-2.5 rounded-full ring-2 ring-white dark:ring-slate-900',
            statusColors[status],
          )}
        />
      )}
    </div>
  );
}
