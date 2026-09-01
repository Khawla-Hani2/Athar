import { cn } from '@/lib/cn'
import type { CSSProperties } from 'react'

interface IconProps {
  name: string
  className?: string
  style?: CSSProperties
}

export function Icon({ name, className, style }: IconProps) {
  return (
    <svg className={cn('icon', className)} style={style}>
      <use href={`#i-${name}`} />
    </svg>
  )
}
