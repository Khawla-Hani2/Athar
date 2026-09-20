import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { Card } from '@/components/ui/Card';
import { AppAreaChart } from '@/components/charts/AppAreaChart';
import { AppBarChart } from '@/components/charts/AppBarChart';
import { AppLineChart } from '@/components/charts/AppLineChart';
import { AppDonutChart } from '@/components/charts/AppDonutChart';
import { analyticsSnapshot } from '@/data';
import { cn } from '@/utils/cn';

export default function Analytics() {
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly');

  const reachData = analyticsSnapshot.engagementByPlatform.map((p) => ({ name: p.platform, value: p.reach }));

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Interactive dashboards across content, campaigns, and team performance."
        action={
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['weekly', 'monthly'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition',
                  range === r
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title={range === 'weekly' ? 'Weekly Performance' : 'Monthly Statistics'} subtitle="Total reach over time" className="xl:col-span-2">
          {range === 'weekly' ? (
            <AppAreaChart data={analyticsSnapshot.weeklyPerformance} xKey="label" yKey="value" />
          ) : (
            <AppBarChart data={analyticsSnapshot.monthlyStatistics} xKey="label" bars={[{ key: 'value', name: 'Reach' }]} />
          )}
        </ChartCard>

        <ChartCard title="Reach by Platform" subtitle="Share of total reach">
          <AppDonutChart data={reachData} height={240} />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard title="Engagement by Platform" subtitle="Likes, comments & shares">
          <AppBarChart
            data={analyticsSnapshot.engagementByPlatform.map((p) => ({ name: p.platform, likes: p.likes, comments: p.comments, shares: p.shares }))}
            xKey="name"
            bars={[
              { key: 'likes', name: 'Likes' },
              { key: 'comments', name: 'Comments' },
              { key: 'shares', name: 'Shares' },
            ]}
          />
        </ChartCard>

        <ChartCard title="Campaign Performance" subtitle="Reach vs. engagement by campaign">
          <AppLineChart
            data={analyticsSnapshot.campaignPerformance.map((c) => ({ name: c.name.split(' ').slice(0, 2).join(' '), reach: c.reach, engagement: c.engagement }))}
            xKey="name"
            lines={[
              { key: 'reach', name: 'Reach' },
              { key: 'engagement', name: 'Engagement' },
            ]}
          />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard title="Team Productivity" subtitle="Tasks completed per member">
          <AppBarChart
            data={analyticsSnapshot.teamProductivity.map((p) => ({ name: p.memberName.split(' ')[0], tasks: p.tasksCompleted }))}
            xKey="name"
            bars={[{ key: 'tasks', name: 'Tasks Completed' }]}
          />
        </ChartCard>

        <Card className="p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Top Performing Content</h3>
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
            {analyticsSnapshot.contentPerformance.map((c) => (
              <div key={c.postTitle} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{c.postTitle}</p>
                  <p className="text-xs text-slate-400">{c.platform}</p>
                </div>
                <div className="shrink-0 text-right text-xs text-slate-400">
                  <p className="font-medium text-slate-700 dark:text-slate-200">{c.engagement.toLocaleString()} eng.</p>
                  <p>{c.reach.toLocaleString()} reach</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
