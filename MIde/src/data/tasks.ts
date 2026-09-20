import type { Task, TaskPriority, TaskStatus } from '@/types';

const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];
const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const assignees = ['u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'];

const taskTitles = [
  'Design Instagram carousel for giving drive',
  'Write caption set for weekly posts',
  'Edit highlight reel from summit',
  'Shoot product photos for open day',
  'Review campaign analytics dashboard',
  'Prepare brand guideline update',
  'Schedule next week\'s content batch',
  'Draft press release for rebrand',
  'Create motion graphic intro',
  'Translate announcement to Arabic',
  'Compile weekly performance report',
  'Update media library tags',
  'Coordinate with sponsors on assets',
  'Storyboard TikTok series',
  'Proofread newsletter draft',
  'Build landing page mockup',
];

export const tasks: Task[] = Array.from({ length: 24 }).map((_, i) => {
  const status = statuses[i % statuses.length];
  const day = 5 + (i % 24);
  return {
    id: `t${i + 1}`,
    title: taskTitles[i % taskTitles.length],
    description:
      'Ensure the deliverable aligns with the current campaign brief and brand guidelines before submitting for review.',
    priority: priorities[i % priorities.length],
    deadline: `2026-0${1 + (i % 3)}-${String(day).padStart(2, '0')}`,
    assigneeId: assignees[i % assignees.length],
    campaignId: `c${1 + (i % 6)}`,
    attachments:
      i % 3 === 0
        ? [{ id: `att${i}`, name: 'reference.pdf', type: 'pdf', url: '#', size: '1.2 MB' }]
        : [],
    comments:
      i % 2 === 0
        ? [
            {
              id: `cm${i}`,
              authorId: assignees[(i + 1) % assignees.length],
              message: 'Looks good, just tweak the color contrast a bit.',
              createdAt: `2026-0${1 + (i % 3)}-${String(Math.max(1, day - 2)).padStart(2, '0')}`,
            },
          ]
        : [],
    status,
    tags: ['Content', 'Q1'],
    createdAt: `2026-0${1 + (i % 3)}-01`,
  };
});

export const getTaskById = (id: string): Task | undefined => tasks.find((t) => t.id === id);
