import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Wallet, Target, Users, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { AppDonutChart } from '@/components/charts/AppDonutChart';
import { getCampaignById, getUserById, posts as allPosts } from '@/data';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
import NotFound from './NotFound';

export default function CampaignDetail() {
  const { id } = useParams();
  const campaign = id ? getCampaignById(id) : undefined;

  if (!campaign) return <NotFound />;

  const campaignPosts = allPosts.filter((p) => p.campaignId === campaign.id);
  const budgetData = [
    { name: 'Spent', value: campaign.spent },
    { name: 'Remaining', value: Math.max(0, campaign.budget - campaign.spent) },
  ];

  return (
    <div>
      <Link
        to="/campaigns"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
      >
        <ArrowLeft className="size-4" /> Back to Campaigns
      </Link>

      <PageHeader
        title={campaign.name}
        description={campaign.description}
        action={<StatusBadge status={campaign.status} />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <Target className="size-4" /> <span className="text-xs">Goal</span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">{campaign.goal}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet className="size-4" /> <span className="text-xs">Budget</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{formatCurrency(campaign.budget)}</p>
          <p className="text-xs text-slate-400">{formatCurrency(campaign.spent)} spent</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <FileText className="size-4" /> <span className="text-xs">Posts</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{campaign.postsCount}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="size-4" /> <span className="text-xs">Team</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{campaign.teamMemberIds.length}</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Timeline & Progress</h3>
          <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{formatDate(campaign.startDate)}</span>
            <span>{formatDate(campaign.endDate)}</span>
          </div>
          <ProgressBar value={campaign.progress} color={campaign.coverColor} className="h-3" />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{campaign.progress}% complete</p>

          <h3 className="mb-3 mt-8 text-base font-semibold text-slate-900 dark:text-white">Analytics Summary</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Reach</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatNumber(campaign.analytics.reach)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Engagement</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatNumber(campaign.analytics.engagement)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Impressions</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatNumber(campaign.analytics.impressions)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Clicks</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatNumber(campaign.analytics.clicks)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Conversion</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{campaign.analytics.conversionRate}%</p>
            </div>
          </div>

          <h3 className="mb-3 mt-8 text-base font-semibold text-slate-900 dark:text-white">Campaign Posts</h3>
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
            {campaignPosts.length === 0 && <p className="py-4 text-sm text-slate-400">No posts linked yet.</p>}
            {campaignPosts.slice(0, 6).map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{post.title}</p>
                  <p className="text-xs text-slate-400">{post.platform}</p>
                </div>
                <StatusBadge status={post.status} />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Budget Usage</h3>
            <AppDonutChart data={budgetData} height={200} />
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Team Members</h3>
            <div className="flex flex-col gap-3">
              {campaign.teamMemberIds.map((id) => {
                const member = getUserById(id);
                if (!member) return null;
                return (
                  <div key={id} className="flex items-center gap-3">
                    <Avatar src={member.avatar} name={member.name} size="sm" status={member.status} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{member.name}</p>
                      <p className="truncate text-xs text-slate-400">{member.title}</p>
                    </div>
                    <Badge>{member.role}</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
