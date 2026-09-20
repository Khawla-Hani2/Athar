import { useMemo, useState } from 'react';
import { Plus, Instagram, Linkedin, Youtube, Facebook, Music2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { posts, getUserById } from '@/data';
import type { PostStatus, SocialPlatform } from '@/types';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

const PLATFORM_ICONS: Record<SocialPlatform, typeof Instagram> = {
  Instagram: Instagram,
  X: Music2,
  LinkedIn: Linkedin,
  TikTok: Music2,
  Facebook: Facebook,
  YouTube: Youtube,
};

const PLATFORMS: SocialPlatform[] = ['Instagram', 'X', 'LinkedIn', 'TikTok', 'Facebook', 'YouTube'];
const STATUSES: PostStatus[] = ['Draft', 'Review', 'Approved', 'Scheduled', 'Published', 'Rejected'];

export default function ContentPlanner() {
  const [platform, setPlatform] = useState<'all' | SocialPlatform>('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const matchesPlatform = platform === 'all' || p.platform === platform;
        const matchesStatus = status === 'all' || p.status === status;
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        return matchesPlatform && matchesStatus && matchesSearch;
      }),
    [platform, status, search],
  );

  return (
    <div>
      <PageHeader
        title="Content Planner"
        description="Plan and manage content across every social channel."
        action={
          <Button size="sm">
            <Plus className="size-4" /> New Post
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setPlatform('all')}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
            platform === 'all'
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-slate-200 text-slate-500 hover:border-brand-300 dark:border-slate-700 dark:text-slate-400',
          )}
        >
          All Platforms
        </button>
        {PLATFORMS.map((p) => {
          const Icon = PLATFORM_ICONS[p];
          return (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
                platform === p
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-200 text-slate-500 hover:border-brand-300 dark:border-slate-700 dark:text-slate-400',
              )}
            >
              <Icon className="size-3.5" /> {p}
            </button>
          );
        })}
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search posts..." className="sm:max-w-xs" />
        <FilterDropdown
          label="Statuses"
          value={status}
          options={STATUSES.map((s) => ({ label: s, value: s }))}
          onChange={setStatus}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No content found" description="Try adjusting your filters or search term." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((post) => {
            const author = getUserById(post.authorId);
            const Icon = PLATFORM_ICONS[post.platform];
            return (
              <Card key={post.id} className="flex flex-col overflow-hidden">
                {post.mediaUrl && (
                  <img src={post.mediaUrl} alt={post.title} className="h-32 w-full object-cover" loading="lazy" />
                )}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Icon className="size-3.5" /> {post.platform}
                    </span>
                    <StatusBadge status={post.status} />
                  </div>
                  <p className="line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-100">{post.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{post.caption}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Avatar src={author?.avatar} name={author?.name ?? '?'} size="xs" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{author?.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(post.scheduledAt)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
