export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskComment {
  id: string;
  authorId: string;
  message: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  deadline: string;
  assigneeId: string;
  campaignId?: string;
  attachments: TaskAttachment[];
  comments: TaskComment[];
  status: TaskStatus;
  tags: string[];
  createdAt: string;
}
