import { useState } from 'react';
import {
  Sparkles, MessageSquare, Hash, Lightbulb, CalendarDays, Repeat, Languages, Mail, Megaphone,
  Linkedin, Instagram, Twitter, Music2, MousePointerClick, Search, FileSearch, Copy, Check, Wand2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { aiTools } from '@/data';
import type { AiTool } from '@/types';
import { generateAiContent } from '@/services/aiService';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, MessageSquare, Hash, Lightbulb, CalendarDays, Repeat, Languages, Mail, Megaphone,
  Linkedin, Instagram, Twitter, Music2, MousePointerClick, Search, FileSearch,
};

const CATEGORIES = ['All', 'Content', 'Social', 'Utility', 'SEO'] as const;

export default function AiAssistant() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [activeTool, setActiveTool] = useState<AiTool | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredTools = category === 'All' ? aiTools : aiTools.filter((t) => t.category === category);

  const openTool = (tool: AiTool) => {
    setActiveTool(tool);
    setPrompt('');
    setResult('');
    setCopied(false);
  };

  const handleGenerate = async () => {
    if (!activeTool || !prompt.trim()) return;
    setIsGenerating(true);
    const output = await generateAiContent(activeTool.id, prompt);
    setResult(output);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Your creative workspace — generate content, ideas, and copy in seconds."
        action={<Badge color="brand">Mock AI — ready for API integration</Badge>}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              category === c
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-slate-200 text-slate-500 hover:border-brand-300 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => {
          const Icon = ICON_MAP[tool.icon] ?? Sparkles;
          return (
            <Card
              key={tool.id}
              onClick={() => openTool(tool)}
              className="flex cursor-pointer flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{tool.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={!!activeTool} onClose={() => setActiveTool(null)} title={activeTool?.name} size="lg">
        {activeTool && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">{activeTool.description}</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTool.placeholder}
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!prompt.trim()} className="self-start">
              <Wand2 className="size-4" /> Generate
            </Button>

            {result && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Result</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">{result}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
