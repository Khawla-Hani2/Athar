import { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type PadSize = 'lg' | 'md' | 'none'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  pad?: PadSize
}

const PAD_CLASS: Record<PadSize, string> = {
  lg: 'p-6',
  md: 'p-[18px]',
  none: '',
}

export function Card({ pad = 'lg', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-surface border border-line rounded-lg shadow-card', PAD_CLASS[pad], className)}
      {...props}
    >
      {children}
    </div>
  )
}
