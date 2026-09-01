import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { toArabicDigits } from '@/utils/date'
import { cn } from '@/lib/cn'

interface ComparisonCardProps {
  title: string
  currentPercentage: number
  previousPercentage: number
  previousLabel: string
  bars: number[]
}

export function ComparisonCard({ title, currentPercentage, previousPercentage, previousLabel, bars }: ComparisonCardProps) {
  const delta = currentPercentage - previousPercentage
  const positive = delta >= 0

  return (
    <Card>
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[16px]">{title}</h2>
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="text-[28px] sm:text-[30px] font-bold">٪{toArabicDigits(currentPercentage)}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[12.5px] font-bold',
            positive ? 'text-success-600' : 'text-crit-600'
          )}
        >
          <Icon name={positive ? 'up' : 'down'} className="w-[13px] h-[13px]" />
          {positive ? '+' : '−'}٪{toArabicDigits(Math.abs(delta))}
        </span>
      </div>
      <p className="text-[12px] text-ink-500 mt-1">
        مقارنة بـ ٪{toArabicDigits(previousPercentage)} {previousLabel}
      </p>
      <div className="flex items-end gap-1.5 h-[70px] mt-4.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-teal-tintStrong"
            style={{ height: `${Math.max(4, h)}%` }}
          />
        ))}
      </div>
    </Card>
  )
}
