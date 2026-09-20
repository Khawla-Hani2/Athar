import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { brandColors, brandFonts, brandTemplates, brandGuidelines } from '@/data';
import { cn } from '@/utils/cn';

export default function BrandCenter() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <PageHeader title="Brand Center" description="Colors, typography, logos, templates, and guidelines in one place." />

      <section className="mb-8">
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Brand Colors</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brandColors.map((color) => (
            <Card key={color.hex} className="overflow-hidden">
              <div className="h-20" style={{ backgroundColor: color.hex }} />
              <div className="p-4">
                <p className="font-medium text-slate-800 dark:text-slate-100">{color.name}</p>
                <p className="mb-2 text-xs text-slate-400">{color.usage}</p>
                <button
                  onClick={() => copyHex(color.hex)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {copied === color.hex ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {color.hex}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Typography</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {brandFonts.map((font) => (
            <Card key={font.name} className="p-5">
              <p className="text-xs uppercase tracking-wide text-slate-400">{font.role}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{font.name}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{font.sample}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {font.weights.map((w) => (
                  <span
                    key={w}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Design Templates</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brandTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <img src={template.thumbnail} alt={template.name} className="h-32 w-full object-cover" loading="lazy" />
              <div className="p-3">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{template.name}</p>
                <p className="text-xs text-slate-400">{template.category}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Brand Guidelines</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {brandGuidelines.map((guide, i) => (
            <Card key={guide.title} className={cn('p-5', i === brandGuidelines.length - 1 && 'lg:col-span-2')}>
              <h3 className="mb-1.5 font-medium text-slate-800 dark:text-slate-100">{guide.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{guide.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
