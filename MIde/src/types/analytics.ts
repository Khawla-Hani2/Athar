export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export interface EngagementBreakdown {
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}

export interface ContentPerformance {
  postTitle: string;
  platform: string;
  engagement: number;
  reach: number;
  clicks: number;
}

export interface TeamProductivityPoint {
  memberName: string;
  tasksCompleted: number;
  hoursLogged: number;
  score: number;
}

export interface AnalyticsSnapshot {
  weeklyPerformance: TimeSeriesPoint[];
  monthlyStatistics: TimeSeriesPoint[];
  engagementByPlatform: EngagementBreakdown[];
  contentPerformance: ContentPerformance[];
  teamProductivity: TeamProductivityPoint[];
  campaignPerformance: { name: string; reach: number; engagement: number; conversion: number }[];
}
