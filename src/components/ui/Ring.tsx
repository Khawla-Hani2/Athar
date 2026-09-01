import { cn } from '@/lib/cn'
import { toArabicDigits } from '@/utils/date'

interface RingProps {
  percentage: number
  color?: string
  size?: number
  label?: string
  className?: string
}

export function Ring({ percentage, color = 'var(--teal-600)', size = 76, label, className }: RingProps) {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)))
  const inset = Math.max(6, Math.round(size * 0.105))
  return (
    <div
      className={cn('relative shrink-0 rounded-full flex items-center justify-center', className)}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} calc(${pct}*1%), var(--line-soft) 0)`,
      }}
    >
      <div
        className="absolute rounded-full bg-surface flex items-center justify-center"
        style={{ inset }}
      >
        <b style={{ fontSize: size < 60 ? 12 : 15 }} className="relative z-10 font-bold text-ink-900">
          {label ?? `٪${toArabicDigits(pct)}`}
        </b>
      </div>
    </div>
  )
}
