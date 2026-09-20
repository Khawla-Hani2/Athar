import {
  FileText,
  Megaphone,
  ListChecks,
  CheckCircle2,
  PenTool,
  Plus,
  CalendarPlus,
  Sparkles,
  UploadCloud,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppAreaChart } from '@/components/charts/AppAreaChart';
import { AppBarChart } from '@/components/charts/AppBarChart';
import { posts, campaigns, tasks, designRequests, analyticsSnapshot, calendarEvents, getUserById } from '@/data';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/format';

const quickActions = [
  { label: 'New Campaign', icon: Megaphone, path: '/campaigns' },
  { label: 'New Task', icon: Plus, path: '/tasks' },
  { label: 'Schedule Post', icon: CalendarPlus, path: '/calendar' },
  { label: 'AI Assistant', icon: Sparkles, path: '/ai-assistant' },
  { label: 'Upload Media', icon: UploadCloud, path: '/media-library' },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  const activeCampaigns = campaigns.filter((c) => c.status === 'active');
  const openTasks = tasks.filter((t) => t.status !== 'done');
  const completedTasks = tasks.filter((t) => t.status === 'done');
  const pendingDesignRequests = designRequests.filter((d) => d.status !== 'completed');

  const upcomingDeadlines = [...tasks]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const recentActivity = [...posts]
    .filter((p) => p.status === 'Published' || p.status === 'Scheduled')
    .slice(0, 6);

  const upcomingEvents = [...calendarEvents]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0] ?? ''}`}
        description="Here's what's happening across your media operations today."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total Posts" value={posts.length.toString()} icon={FileText} trend={8.2} color="#2a78d6" />
        <StatCard label="Active Campaigns" value={activeCampaigns.length.toString()} icon={Megaphone} trend={4.1} color="#4a3aa7" />
        <StatCard label="Open Tasks" value={openTasks.length.toString()} icon={ListChecks} trend={-2.4} color="#eda100" />
        <StatCard label="Completed Tasks" value={completedTasks.length.toString()} icon={CheckCircle2} trend={12.6} color="#008300" />
        <StatCard label="Design Requests" value={pendingDesignRequests.length.toString()} icon={PenTool} trend={3.3} color="#e87ba4" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <ChartCard title="Weekly Performance" subtitle="Engagement across all platforms" className="xl:col-span-2">
          <AppAreaChart data={analyticsSnapshot.weeklyPerformance} xKey="label" yKey="value" />
        </ChartCard>

        <Card className="p-5">
          <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
          <p className="mb-4 text-sm text-slate-400">Jump right into your workflow</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex flex-col items-start gap-2 rounded-xl border border-slate-100 p-3 text-sm font-medium text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-brand-800 dark:hover:bg-brand-900/20"
              >
                <action.icon className="size-5 text-brand-500" />
                {action.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <ChartCard title="Monthly Statistics" subtitle="Total reach by month" className="xl:col-span-2">
          <AppBarChart data={analyticsSnapshot.monthlyStatistics} xKey="label" bars={[{ key: 'value', name: 'Reach' }]} />
        </ChartCard>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Team Productivity</h3>
            <Link to="/team" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {analyticsSnapshot.teamProductivity.slice(0, 5).map((member) => (
              <div key={member.memberName}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{member.memberName}</span>
                  <span className="text-slate-400">{member.score}%</span>
                </div>
                <ProgressBar value={member.score} color="#4a3aa7" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
            <Link to="/tasks" className="text-slate-400 hover:text-brand-500">
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {upcomingDeadlines.map((task) => {
              const assignee = getUserById(task.assigneeId);
              return (
                <li key={task.id} className="flex items-center gap-3">
                  <Avatar src={assignee?.avatar} name={assignee?.name ?? '?'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{task.title}</p>
                    <p className="text-xs text-slate-400">{formatDate(task.deadline)}</p>
                  </div>
                  <Badge color={task.priority === 'urgent' ? 'red' : task.priority === 'high' ? 'amber' : 'slate'}>
                    {task.priority}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {recentActivity.map((post) => {
              const author = getUserById(post.authorId);
              return (
                <li key={post.id} className="flex items-start gap-3">
                  <Avatar src={author?.avatar} name={author?.name ?? '?'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-700 dark:text-slate-200">
                      <span className="font-medium">{author?.name}</span> posted on {post.platform}
                    </p>
                    <p className="truncate text-xs text-slate-400">{post.title}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Upcoming Calendar</h3>
            <Link to="/calendar" className="text-slate-400 hover:text-brand-500">
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="flex items-center gap-3">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{event.title}</p>
                  <p className="text-xs text-slate-400">
                    {formatDate(event.date)} {event.time && `· ${event.time}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
