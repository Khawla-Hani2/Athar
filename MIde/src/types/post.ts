export type SocialPlatform =
  | 'Instagram'
  | 'X'
  | 'LinkedIn'
  | 'TikTok'
  | 'Facebook'
  | 'YouTube';

export type PostStatus =
  | 'Draft'
  | 'Review'
  | 'Approved'
  | 'Scheduled'
  | 'Published'
  | 'Rejected';

export interface Post {
  id: string;
  title: string;
  caption: string;
  platform: SocialPlatform;
  status: PostStatus;
  scheduledAt: string;
  authorId: string;
  campaignId?: string;
  mediaUrl?: string;
  hashtags: string[];
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
}
