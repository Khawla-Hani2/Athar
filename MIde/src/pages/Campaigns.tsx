import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, FileText, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { campaigns, getUserById } from '@/data';
import { formatCurrency, formatDate } from '@/utils/format';
import type { CampaignStatus } from '@/types';

const STATUS_OPTIONS: { label: string; value: CampaignStatus }[] = [
  { label: 'Planning', value: 'planning' },
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

export default function Campaigns() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(
    () =>
      campaigns.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || c.status === status;
        return matchesSearch && matchesStatus;
      }),
    [search, status],
  );

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Plan, launch, and track every media campaign in one place."
        action={
          <Button size="sm">
            <Plus className="size-4" /> New Campaign
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search campaigns..." className="sm:max-w-xs" />
        <FilterDropdown label="Statuses" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No campaigns found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((campaign) => (
            <Link key={campaign.id} to={`/campaigns/${campaign.id}`}>
              <Card className="flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className="flex size-10 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: campaign.coverColor }}
                  >
                    <FileText className="size-5" />
                  </div>
                  <StatusBadge status={campaign.status} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{campaign.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{campaign.description}</p>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatDate(campaign.startDate)}</span>
                  <span>→</span>
                  <span>{formatDate(campaign.endDate)}</span>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <ProgressBar value={campaign.progress} color={campaign.coverColor} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex -space-x-2">
                    {campaign.teamMemberIds.slice(0, 4).map((id) => {
                      const member = getUserById(id);
                      return member ? <Avatar key={id} src={member.avatar} name={member.name} size="xs" /> : null;
                    })}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <FileText className="size-3.5" /> {campaign.postsCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="size-3.5" /> {formatCurrency(campaign.budget)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" /> {campaign.teamMemberIds.length}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
