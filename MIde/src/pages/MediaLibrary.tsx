import { useMemo, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Video, PenTool, Shapes, Folder } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { mediaAssets, getUserById } from '@/data';
import type { MediaAsset, MediaType } from '@/types';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

const TYPE_ICONS: Record<MediaType, typeof ImageIcon> = {
  image: ImageIcon,
  video: Video,
  document: FileText,
  logo: PenTool,
  icon: Shapes,
};

const TYPE_OPTIONS = [
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Documents', value: 'document' },
  { label: 'Logos', value: 'logo' },
  { label: 'Icons', value: 'icon' },
];

export default function MediaLibrary() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [folder, setFolder] = useState('all');
  const [preview, setPreview] = useState<MediaAsset | null>(null);

  const folders = useMemo(() => [...new Set(mediaAssets.map((m) => m.folder.split('/')[0]))], []);

  const filtered = useMemo(
    () =>
      mediaAssets.filter((m) => {
        const matchesSearch =
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchesType = type === 'all' || m.type === type;
        const matchesFolder = folder === 'all' || m.folder.startsWith(folder);
        return matchesSearch && matchesType && matchesFolder;
      }),
    [search, type, folder],
  );

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Your central hub for images, videos, documents, logos, and icons."
        action={
          <Button size="sm">
            <Upload className="size-4" /> Upload
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setFolder('all')}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
            folder === 'all'
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400',
          )}
        >
          <Folder className="size-3.5" /> All Folders
        </button>
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
              folder === f
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400',
            )}
          >
            <Folder className="size-3.5" /> {f}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or tag..." className="sm:max-w-xs" />
        <FilterDropdown label="Types" value={type} options={TYPE_OPTIONS} onChange={setType} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No media found" description="Try a different search term or filter." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((asset) => {
            const Icon = TYPE_ICONS[asset.type];
            return (
              <Card
                key={asset.id}
                onClick={() => setPreview(asset)}
                className="group cursor-pointer overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {asset.thumbnailUrl ? (
                    <img src={asset.thumbnailUrl} alt={asset.name} className="size-full object-cover" loading="lazy" />
                  ) : (
                    <Icon className="size-8 text-slate-400" />
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{asset.name}</p>
                  <p className="text-xs text-slate-400">{asset.size}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!preview} onClose={() => setPreview(null)} title={preview?.name} size="lg">
        {preview && (
          <div className="flex flex-col gap-4">
            <div className="flex max-h-80 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              {preview.thumbnailUrl ? (
                <img src={preview.url} alt={preview.name} className="max-h-80 w-full object-contain" />
              ) : (
                <FileText className="size-16 text-slate-400" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Category</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{preview.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Folder</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{preview.folder}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Size</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{preview.size}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Uploaded</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">
                  {formatDate(preview.uploadedAt)} by {getUserById(preview.uploadedBy)?.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {preview.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
