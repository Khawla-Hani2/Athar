import { useState } from 'react';
import { Mail, MapPin, Phone, Calendar, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuthStore } from '@/store/authStore';
import { tasks, campaigns } from '@/data';
import { ROLE_COLORS } from '@/constants/roles';
import { formatDate } from '@/utils/format';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');

  if (!user) return null;

  const myTasks = tasks.filter((t) => t.assigneeId === user.id);
  const doneTasks = myTasks.filter((t) => t.status === 'done');
  const myCampaigns = campaigns.filter((c) => c.teamMemberIds.includes(user.id));

  return (
    <div>
      <PageHeader title="Profile" description="Your personal information and activity overview." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar src={user.avatar} name={user.name} size="lg" status={user.status} className="mb-3 size-20" />
            {isEditing ? (
              <Input value={name} onChange={(e) => setName(e.target.value)} className="text-center" />
            ) : (
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{name}</h2>
            )}
            <p className="text-sm text-slate-400">{user.title}</p>
            <Badge className="mt-2" style={{ backgroundColor: `${ROLE_COLORS[user.role]}1a`, color: ROLE_COLORS[user.role] }}>
              {user.role}
            </Badge>
          </div>

          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 text-slate-400" /> {user.email}
            </div>
            {user.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-slate-400" /> {user.phone}
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-slate-400" /> {user.location}
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <Calendar className="size-4 text-slate-400" /> Joined {formatDate(user.joinedAt)}
            </div>
          </div>

          <Button
            variant="outline"
            className="mt-6 w-full justify-center"
            onClick={() => setIsEditing((e) => !e)}
          >
            <Pencil className="size-4" /> {isEditing ? 'Save Profile' : 'Edit Profile'}
          </Button>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card className="p-6">
            <h3 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">About</h3>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900"
              />
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">{bio}</p>
            )}
            {user.skills && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {user.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{myTasks.length}</p>
              <p className="text-xs text-slate-400">Total Tasks</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{doneTasks.length}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{myCampaigns.length}</p>
              <p className="text-xs text-slate-400">Campaigns</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{user.productivity}%</p>
              <p className="text-xs text-slate-400">Productivity</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Productivity Score</h3>
            <ProgressBar value={user.productivity} className="h-3" />
          </Card>
        </div>
      </div>
    </div>
  );
}
