import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  message: string
  icon?: ReactNode
  compact?: boolean
}

export function EmptyState({ message, icon, compact }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3.5 text-center', compact ? 'py-8' : 'py-14')}>
      {icon && (
        <div className="w-14 h-14 rounded-full bg-paper-alt flex items-center justify-center text-teal-600/70">
          {icon}
        </div>
      )}
      <p className="text-[13.5px] font-medium text-ink-500 max-w-[280px] leading-relaxed">{message}</p>
    </div>
  )
}
