import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { MonthlyHistoryEntry } from '@/types/stats'
import { MONTH_NAMES_AR, toArabicDigits } from '@/utils/date'

interface MonthlyHistoryChartProps {
  entries: MonthlyHistoryEntry[]
}

export function MonthlyHistoryChart({ entries }: MonthlyHistoryChartProps) {
  const data = entries.map((e) => {
    const [, m] = e.month.split('-')
    return { name: MONTH_NAMES_AR[Number(m) - 1]?.slice(0, 3) ?? e.month, percentage: e.percentage }
  })

  return (
    <Card>
      <h2 className="text-[16px] mb-3.5">السجل الشهري</h2>
      {data.length === 0 ? (
        <EmptyState message="سيظهر سجل الإنجاز الشهري هنا مع نهاية أول شهر." icon={<Icon name="cal-days" className="w-6 h-6" />} />
      ) : (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line-soft)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--ink-500)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: 'var(--ink-500)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
                tickFormatter={(v) => `${toArabicDigits(v)}٪`}
              />
              <Tooltip
                formatter={(value: number) => [`٪${toArabicDigits(value)}`, 'الإنجاز']}
                contentStyle={{
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="percentage" fill="var(--teal-600)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
