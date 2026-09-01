import { Card } from '@/components/ui/Card'
import { Ring } from '@/components/ui/Ring'
import { toArabicDigits } from '@/utils/date'

interface StatCardProps {
  label: string
  completed: number
  total: number
  percentage: number
  color: string
  unit?: string
}

export function StatCard({ label, completed, total, percentage, color, unit = 'مهام' }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between gap-3.5">
      <div>
        <p className="text-[13px] font-semibold text-ink-700">{label}</p>
        <p className="text-[13px] text-ink-500 mt-1.5">
          <b className="text-ink-900 text-[15px] font-bold">{toArabicDigits(completed)}</b> / {toArabicDigits(total)} {unit}
        </p>
      </div>
      <Ring percentage={percentage} color={color} />
    </Card>
  )
}
