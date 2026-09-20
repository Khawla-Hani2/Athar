import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { contentRequests, getUserById } from '@/data';
import type { ContentRequest } from '@/types';
import { formatDate } from '@/utils/format';

const STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function ContentRequests() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(
    () =>
      contentRequests.filter((r) => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || r.status === status;
        return matchesSearch && matchesStatus;
      }),
    [search, status],
  );

  const columns: DataTableColumn<ContentRequest>[] = [
    {
      key: 'title',
      header: 'Request',
      render: (r) => (
        <div className="max-w-xs">
          <p className="font-medium text-slate-800 dark:text-slate-100">{r.title}</p>
          <p className="line-clamp-1 text-xs text-slate-400">{r.brief}</p>
        </div>
      ),
    },
    { key: 'platform', header: 'Platform', render: (r) => <Badge>{r.platform}</Badge> },
    {
      key: 'writer',
      header: 'Assigned Writer',
      render: (r) => {
        const writer = r.assignedWriterId ? getUserById(r.assignedWriterId) : undefined;
        return writer ? (
          <div className="flex items-center gap-2">
            <Avatar src={writer.avatar} name={writer.name} size="xs" />
            <span className="text-sm">{writer.name}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-400">Unassigned</span>
        );
      },
    },
    { key: 'due', header: 'Due Date', render: (r) => formatDate(r.dueDate) },
    {
      key: 'priority',
      header: 'Priority',
      render: (r) => <StatusBadge status={r.priority} />,
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Content Requests"
        description="Track content briefs from request to publish-ready copy."
        action={
          <Button size="sm">
            <Plus className="size-4" /> New Request
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search requests..." className="sm:max-w-xs" />
        <FilterDropdown label="Statuses" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
      </div>

      <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} emptyTitle="No content requests found" />
    </div>
  );
}
