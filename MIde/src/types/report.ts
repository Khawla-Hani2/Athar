export type ReportType = 'weekly' | 'monthly' | 'campaign' | 'team';
export type ReportFormat = 'pdf' | 'excel';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  description: string;
  createdAt: string;
  period: string;
  generatedBy: string;
  size: string;
  formats: ReportFormat[];
}
