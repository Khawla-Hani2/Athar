import type { AnalyticsSnapshot } from '@/types';

export const analyticsSnapshot: AnalyticsSnapshot = {
  weeklyPerformance: [
    { label: 'Mon', value: 3200 },
    { label: 'Tue', value: 4100 },
    { label: 'Wed', value: 3800 },
    { label: 'Thu', value: 5200 },
    { label: 'Fri', value: 6100 },
    { label: 'Sat', value: 4700 },
    { label: 'Sun', value: 3900 },
  ],
  monthlyStatistics: [
    { label: 'Jan', value: 42000 },
    { label: 'Feb', value: 51000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 61000 },
    { label: 'May', value: 58000 },
    { label: 'Jun', value: 67000 },
    { label: 'Jul', value: 72000 },
  ],
  engagementByPlatform: [
    { platform: 'Instagram', likes: 42000, comments: 5400, shares: 2100, reach: 380000 },
    { platform: 'X', likes: 18000, comments: 3100, shares: 4200, reach: 210000 },
    { platform: 'LinkedIn', likes: 9800, comments: 1200, shares: 1600, reach: 145000 },
    { platform: 'TikTok', likes: 61000, comments: 8900, shares: 12000, reach: 520000 },
    { platform: 'Facebook', likes: 15400, comments: 2200, shares: 1900, reach: 190000 },
    { platform: 'YouTube', likes: 7200, comments: 980, shares: 640, reach: 98000 },
  ],
  contentPerformance: [
    { postTitle: 'Behind the scenes at our giving drive', platform: 'Instagram', engagement: 8400, reach: 62000, clicks: 1900 },
    { postTitle: 'Meet this year\'s youth leaders', platform: 'LinkedIn', engagement: 4100, reach: 38000, clicks: 1100 },
    { postTitle: 'Open day countdown begins', platform: 'TikTok', engagement: 12300, reach: 91000, clicks: 2600 },
    { postTitle: 'Our new look, same mission', platform: 'X', engagement: 3900, reach: 29000, clicks: 870 },
    { postTitle: 'Volunteers make it happen', platform: 'Facebook', engagement: 5200, reach: 41000, clicks: 1200 },
  ],
  teamProductivity: [
    { memberName: 'Yousef Nasser', tasksCompleted: 24, hoursLogged: 142, score: 91 },
    { memberName: 'Lina Haddad', tasksCompleted: 31, hoursLogged: 138, score: 88 },
    { memberName: 'Omar Farouk', tasksCompleted: 19, hoursLogged: 121, score: 84 },
    { memberName: 'Sara Khalil', tasksCompleted: 22, hoursLogged: 130, score: 90 },
    { memberName: 'Karim Aziz', tasksCompleted: 17, hoursLogged: 118, score: 87 },
    { memberName: 'Nour Fadel', tasksCompleted: 14, hoursLogged: 96, score: 79 },
  ],
  campaignPerformance: [
    { name: 'Ramadan Giving Drive', reach: 1850000, engagement: 92000, conversion: 4.2 },
    { name: 'Youth Leadership Summit', reach: 640000, engagement: 41000, conversion: 6.1 },
    { name: 'University Open Day', reach: 92000, engagement: 5300, conversion: 2.8 },
    { name: 'Corporate Rebrand Rollout', reach: 2100000, engagement: 130000, conversion: 3.4 },
    { name: 'Annual Impact Report Launch', reach: 540000, engagement: 38000, conversion: 3.9 },
  ],
};
