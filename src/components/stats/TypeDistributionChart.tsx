import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { TASK_TYPE_LABELS, TaskType } from '@/types/task'
import { TYPE_DOT_VAR } from '@/utils/taskVisuals'
import { toArabicDigits } from '@/utils/date'

interface TypeDistributionChartProps {
  counts: Record<TaskType, number>
}

export function TypeDistributionChart({ counts }: TypeDistributionChartProps) {
  const data = (Object.keys(counts) as TaskType[])
    .map((type) => ({ type, value: counts[type] }))
    .filter((d) => d.value > 0)

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <h2 className="text-[16px] mb-3.5">توزيع المهام حسب النوع</h2>
      {total === 0 ? (
        <EmptyState message="ما عندك مهام كافية لعرض التوزيع بعد." icon={<Icon name="chart" className="w-6 h-6" />} />
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div style={{ width: 160, height: 160 }} className="shrink-0">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="type" innerRadius={45} outerRadius={78} strokeWidth={2}>
                  {data.map((d) => (
                    <Cell key={d.type} fill={TYPE_DOT_VAR[d.type]} stroke="var(--surface)" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 w-full flex flex-col gap-2">
            {data.map((d) => (
              <div key={d.type} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 font-semibold text-ink-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_DOT_VAR[d.type] }} />
                  {TASK_TYPE_LABELS[d.type]}
                </span>
                <span className="text-ink-500">
                  {toArabicDigits(d.value)} · ٪{toArabicDigits(Math.round((d.value / total) * 100))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
