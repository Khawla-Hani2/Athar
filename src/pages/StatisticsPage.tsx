import { useEffect, useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/stats/StatCard'
import { ComparisonCard } from '@/components/stats/ComparisonCard'
import { TypeDistributionChart } from '@/components/stats/TypeDistributionChart'
import { MonthlyHistoryChart } from '@/components/stats/MonthlyHistoryChart'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { subscribeToMonthlyHistory } from '@/services/monthlyStatsService'
import { MonthlyHistoryEntry } from '@/types/stats'
import {
  computeCompletion,
  countByType,
  dailyPercentagesForWeek,
  getDayRange,
  getMonthRange,
  getPreviousMonthRange,
  getPreviousWeekRange,
  getWeekRange,
  weeklyPercentagesForMonth,
} from '@/utils/stats'

export function StatisticsPage() {
  const { user } = useAuth()
  const { tasks } = useTasks()
  const [history, setHistory] = useState<MonthlyHistoryEntry[]>([])

  useEffect(() => {
    if (!user) return
    return subscribeToMonthlyHistory(user.uid, setHistory)
  }, [user])

  const now = new Date()
  const [dayStart, dayEnd] = getDayRange(now)
  const [weekStart, weekEnd] = getWeekRange(now)
  const [monthStart, monthEnd] = getMonthRange(now)
  const [prevWeekStart, prevWeekEnd] = getPreviousWeekRange(now)
  const [prevMonthStart, prevMonthEnd] = getPreviousMonthRange(now)

  const dayStats = computeCompletion(tasks, dayStart, dayEnd)
  const weekStats = computeCompletion(tasks, weekStart, weekEnd)
  const monthStats = computeCompletion(tasks, monthStart, monthEnd)
  const prevWeekStats = computeCompletion(tasks, prevWeekStart, prevWeekEnd)
  const prevMonthStats = computeCompletion(tasks, prevMonthStart, prevMonthEnd)

  const weekBars = useMemo(() => dailyPercentagesForWeek(tasks, weekStart), [tasks, weekStart])
  const monthBars = useMemo(() => weeklyPercentagesForMonth(tasks, now), [tasks])
  const typeCounts = useMemo(() => countByType(tasks), [tasks])

  return (
    <div>
      <Topbar title="إحصائياتي" subtitle={<span>نظرة عامة على أدائك</span>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatCard label="إنجاز اليوم" completed={dayStats.completed} total={dayStats.total} percentage={dayStats.percentage} color="var(--teal-600)" />
        <StatCard label="إنجاز هذا الأسبوع" completed={weekStats.completed} total={weekStats.total} percentage={weekStats.percentage} color="var(--palm-700)" unit="مهمة" />
        <StatCard label="إنجاز هذا الشهر" completed={monthStats.completed} total={monthStats.total} percentage={monthStats.percentage} color="var(--sand-600)" unit="مهمة" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <ComparisonCard
          title="هذا الأسبوع مقابل الماضي"
          currentPercentage={weekStats.percentage}
          previousPercentage={prevWeekStats.percentage}
          previousLabel="الأسبوع الماضي"
          bars={weekBars}
        />
        <ComparisonCard
          title="هذا الشهر مقابل الماضي"
          currentPercentage={monthStats.percentage}
          previousPercentage={prevMonthStats.percentage}
          previousLabel="الشهر الماضي"
          bars={monthBars}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TypeDistributionChart counts={typeCounts} />
        <MonthlyHistoryChart entries={history} />
      </div>
    </div>
  )
}
