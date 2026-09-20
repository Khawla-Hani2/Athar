export type AiToolId =
  | 'social-post'
  | 'caption'
  | 'hashtags'
  | 'campaign-ideas'
  | 'content-calendar'
  | 'rewrite'
  | 'translate'
  | 'email'
  | 'announcement'
  | 'linkedin-post'
  | 'instagram-caption'
  | 'x-post'
  | 'tiktok-caption'
  | 'cta'
  | 'seo-title'
  | 'seo-description';

export interface AiTool {
  id: AiToolId;
  name: string;
  description: string;
  icon: string;
  placeholder: string;
  category: 'Content' | 'Social' | 'Utility' | 'SEO';
}

export interface AiHistoryItem {
  id: string;
  toolId: AiToolId;
  prompt: string;
  result: string;
  createdAt: string;
}
