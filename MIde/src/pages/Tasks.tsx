import { useState } from 'react';
import { Plus, Paperclip, MessageCircle, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { tasks as initialTasks } from '@/data';
import { getUserById } from '@/data';
import type { Task, TaskStatus } from '@/types';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
];

const PRIORITY_COLOR = { low: 'slate', medium: 'blue', high: 'amber', urgent: 'red' } as const;

function TaskCard({ task, onDragStart, onClick }: { task: Task; onDragStart: () => void; onClick: () => void }) {
  const assignee = getUserById(task.assigneeId);
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="cursor-pointer p-3.5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <Badge color={PRIORITY_COLOR[task.priority]}>{task.priority}</Badge>
        {assignee && <Avatar src={assignee.avatar} name={assignee.name} size="xs" />}
      </div>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="size-3.5" /> {formatDate(task.deadline, { month: 'short', day: 'numeric' })}
        </span>
        <span className="flex items-center gap-2">
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="size-3.5" /> {task.attachments.length}
            </span>
          )}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" /> {task.comments.length}
            </span>
          )}
        </span>
      </div>
    </Card>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDrop = (status: TaskStatus) => {
    if (!dragId) return;
    setTasks((prev) => prev.map((t) => (t.id === dragId ? { ...t, status } : t)));
    setDragId(null);
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Track work across your media production pipeline."
        action={
          <Button size="sm">
            <Plus className="size-4" /> New Task
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.key)}
              className="flex flex-col gap-3 rounded-2xl bg-slate-100/60 p-3 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{col.label}</h3>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {columnTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={() => setDragId(task.id)}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-700">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask?.title} size="lg">
        {selectedTask && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selectedTask.status} />
              <Badge color={PRIORITY_COLOR[selectedTask.priority]}>{selectedTask.priority} priority</Badge>
              <Badge>{formatDate(selectedTask.deadline)}</Badge>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">{selectedTask.description}</p>

            <div className="flex items-center gap-3">
              {(() => {
                const assignee = getUserById(selectedTask.assigneeId);
                return assignee ? (
                  <>
                    <Avatar src={assignee.avatar} name={assignee.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{assignee.name}</p>
                      <p className="text-xs text-slate-400">{assignee.title}</p>
                    </div>
                  </>
                ) : null;
              })()}
            </div>

            {selectedTask.attachments.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Attachments</h4>
                <div className="flex flex-col gap-2">
                  {selectedTask.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
                    >
                      <Paperclip className="size-4 text-slate-400" />
                      <span className="flex-1 truncate text-slate-700 dark:text-slate-200">{att.name}</span>
                      <span className="text-xs text-slate-400">{att.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTask.comments.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Comments</h4>
                <div className="flex flex-col gap-3">
                  {selectedTask.comments.map((comment) => {
                    const author = getUserById(comment.authorId);
                    return (
                      <div key={comment.id} className="flex items-start gap-2.5">
                        <Avatar src={author?.avatar} name={author?.name ?? '?'} size="xs" />
                        <div className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
                          <p className="font-medium text-slate-800 dark:text-slate-100">{author?.name}</p>
                          <p className="text-slate-600 dark:text-slate-300">{comment.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              {COLUMNS.map((col) => (
                <button
                  key={col.key}
                  onClick={() => {
                    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, status: col.key } : t)));
                    setSelectedTask((t) => (t ? { ...t, status: col.key } : t));
                  }}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
                    selectedTask.status === col.key
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-slate-200 text-slate-500 hover:border-brand-300 dark:border-slate-700',
                  )}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
