import { useMemo, useState } from 'react';
import { Plus, Paperclip, Ruler } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { designRequests, getUserById } from '@/data';
import { formatDate } from '@/utils/format';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'In Review', value: 'in-review' },
  { label: 'Completed', value: 'completed' },
  { label: 'Rejected', value: 'rejected' },
];

export default function DesignRequests() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(
    () =>
      designRequests.filter((r) => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || r.status === status;
        return matchesSearch && matchesStatus;
      }),
    [search, status],
  );

  return (
    <div>
      <PageHeader
        title="Design Requests"
        description="Submit and track creative requests for the design team."
        action={
          <Button size="sm">
            <Plus className="size-4" /> New Request
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search design requests..." className="sm:max-w-xs" />
        <FilterDropdown label="Statuses" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No design requests found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((req) => {
            const designer = getUserById(req.assignedDesignerId);
            return (
              <Card key={req.id} className="flex flex-col p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-medium text-slate-800 dark:text-slate-100">{req.title}</h3>
                  <StatusBadge status={req.status} />
                </div>
                <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{req.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <Badge>{req.platform}</Badge>
                  <span className="flex items-center gap-1">
                    <Ruler className="size-3.5" /> {req.dimensions}
                  </span>
                  <Badge color={req.priority === 'urgent' ? 'red' : req.priority === 'high' ? 'amber' : 'slate'}>
                    {req.priority}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  {designer && (
                    <div className="flex items-center gap-2">
                      <Avatar src={designer.avatar} name={designer.name} size="xs" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{designer.name}</span>
                    </div>
                  )}
                  <span className="text-xs text-slate-400">Due {formatDate(req.dueDate)}</span>
                </div>
                {req.attachments.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                    <Paperclip className="size-3.5" /> {req.attachments.length} attachment(s)
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
