export type ContentRequestStatus = 'new' | 'in-progress' | 'submitted' | 'approved' | 'rejected';

export interface ContentRequest {
  id: string;
  title: string;
  brief: string;
  requestedBy: string;
  assignedWriterId?: string;
  platform: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: ContentRequestStatus;
  createdAt: string;
}
