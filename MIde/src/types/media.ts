export type MediaType = 'image' | 'video' | 'document' | 'logo' | 'icon';

export interface MediaAsset {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  size: string;
  tags: string[];
  category: string;
  folder: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface DesignRequest {
  id: string;
  title: string;
  description: string;
  platform: SocialAndPrintPlatform;
  dimensions: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedDesignerId: string;
  status: 'pending' | 'in-progress' | 'in-review' | 'completed' | 'rejected';
  attachments: { id: string; name: string; url: string }[];
  requestedBy: string;
  createdAt: string;
}

export type SocialAndPrintPlatform =
  | 'Instagram'
  | 'X'
  | 'LinkedIn'
  | 'TikTok'
  | 'Facebook'
  | 'YouTube'
  | 'Print'
  | 'Web';
