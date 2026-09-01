import { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'
import { TaskPriority } from '@/types/task'

interface BadgeProps {
  children: ReactNode
  variant: 'high' | 'medium' | 'low' | 'overdue'
  className?: string
}

const VARIANT_CLASS: Record<BadgeProps['variant'], string> = {
  high: 'bg-pr-highTint text-pr-high',
  medium: 'bg-pr-medTint text-pr-med',
  low: 'bg-pr-lowTint text-pr-low',
  overdue: 'bg-crit-tint text-crit-700',
}

export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-1 rounded-full',
        VARIANT_CLASS[variant],
        className
      )}
    >
      {variant === 'overdue' && <Icon name="warn" className="w-[11px] h-[11px]" />}
      {variant === 'high' && <Icon name="flag" className="w-[11px] h-[11px]" />}
      {children}
    </span>
  )
}

const PRIORITY_TO_VARIANT: Record<TaskPriority, 'high' | 'medium' | 'low'> = {
  high: 'high',
  medium: 'medium',
  low: 'low',
}

export function PriorityBadge({ priority, label }: { priority: TaskPriority; label: string }) {
  return <Badge variant={PRIORITY_TO_VARIANT[priority]}>{label}</Badge>
}
