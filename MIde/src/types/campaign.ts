export type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface CampaignAnalyticsSummary {
  reach: number;
  engagement: number;
  impressions: number;
  clicks: number;
  conversionRate: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  goal: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  teamMemberIds: string[];
  status: CampaignStatus;
  progress: number;
  postsCount: number;
  coverColor: string;
  analytics: CampaignAnalyticsSummary;
}
