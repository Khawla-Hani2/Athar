import { useState } from 'react';
import { UserPlus, ShieldCheck, TrendingUp, Clock } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppBarChart } from '@/components/charts/AppBarChart';
import { users } from '@/data';
import { analyticsSnapshot } from '@/data';
import { ALL_ROLES, ROLE_COLORS, ROLE_PERMISSIONS } from '@/constants/roles';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/constants/nav';
import { cn } from '@/utils/cn';

const TABS = ['Members', 'Roles & Permissions', 'Productivity', 'Attendance', 'Performance'] as const;
type Tab = (typeof TABS)[number];

const ALL_PERMISSION_KEYS = [...NAV_ITEMS, ...BOTTOM_NAV_ITEMS].map((i) => i.permissionKey);

const attendanceMock = users.map((u, i) => ({
  user: u,
  present: 18 + (i % 4),
  absent: i % 5,
  late: i % 3,
}));

export default function Team() {
  const [tab, setTab] = useState<Tab>('Members');

  return (
    <div>
      <PageHeader
        title="Team Management"
        description="Manage members, roles, permissions, and performance."
        action={
          <Button size="sm">
            <UserPlus className="size-4" /> Invite Member
          </Button>
        }
      />

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'shrink-0 rounded-md px-3.5 py-1.5 text-sm font-medium transition',
              tab === t
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 dark:text-slate-400',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Members' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="flex items-center gap-4 p-5">
              <Avatar src={user.avatar} name={user.name} size="lg" status={user.status} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
                <p className="truncate text-xs text-slate-400">{user.title}</p>
                <Badge className="mt-1.5" color="brand">
                  {user.role}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Roles & Permissions' && (
        <div className="flex flex-col gap-4">
          {ALL_ROLES.map((role) => (
            <Card key={role} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${ROLE_COLORS[role]}1a`, color: ROLE_COLORS[role] }}>
                  <ShieldCheck className="size-4" />
                </span>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{role}</h3>
                <span className="text-xs text-slate-400">
                  {users.filter((u) => u.role === role).length} members
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_PERMISSION_KEYS.map((key) => {
                  const allowed = ROLE_PERMISSIONS[role].includes('*') || ROLE_PERMISSIONS[role].includes(key);
                  return (
                    <span
                      key={key}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                        allowed
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-400 line-through dark:bg-slate-800',
                      )}
                    >
                      {key.replace('-', ' ')}
                    </span>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Productivity' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Tasks Completed by Member</h3>
            <AppBarChart
              data={analyticsSnapshot.teamProductivity.map((p) => ({ name: p.memberName.split(' ')[0], tasks: p.tasksCompleted }))}
              xKey="name"
              bars={[{ key: 'tasks', name: 'Tasks Completed' }]}
            />
          </Card>
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
              <TrendingUp className="size-4" /> Productivity Score
            </h3>
            <div className="flex flex-col gap-4">
              {analyticsSnapshot.teamProductivity.map((p) => (
                <div key={p.memberName}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{p.memberName}</span>
                    <span className="text-slate-400">{p.score}%</span>
                  </div>
                  <ProgressBar value={p.score} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'Attendance' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-4 gap-2 border-b border-slate-100 p-4 text-xs font-semibold uppercase text-slate-400 dark:border-slate-800">
            <span>Member</span>
            <span>Present</span>
            <span>Absent</span>
            <span>Late</span>
          </div>
          {attendanceMock.map(({ user, present, absent, late }) => (
            <div key={user.id} className="grid grid-cols-4 items-center gap-2 border-b border-slate-50 p-4 last:border-0 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Avatar src={user.avatar} name={user.name} size="xs" />
                <span className="truncate text-sm text-slate-700 dark:text-slate-200">{user.name}</span>
              </div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">{present} days</span>
              <span className="text-sm text-red-500">{absent} days</span>
              <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                <Clock className="size-3.5" /> {late}
              </span>
            </div>
          ))}
        </Card>
      )}

      {tab === 'Performance' && (
        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Team Performance Overview</h3>
          <AppBarChart
            data={analyticsSnapshot.teamProductivity.map((p) => ({
              name: p.memberName.split(' ')[0],
              hours: p.hoursLogged,
              score: p.score,
            }))}
            xKey="name"
            bars={[
              { key: 'hours', name: 'Hours Logged' },
              { key: 'score', name: 'Score' },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
