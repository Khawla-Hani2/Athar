import type { AiTool } from '@/types';

export const aiTools: AiTool[] = [
  { id: 'social-post', name: 'Generate Social Media Post', description: 'Create a ready-to-publish post for any platform.', icon: 'Sparkles', placeholder: 'e.g. Announce our new volunteer program launching next week', category: 'Social' },
  { id: 'caption', name: 'Generate Caption', description: 'Write an engaging caption for your media.', icon: 'MessageSquare', placeholder: 'e.g. A photo of volunteers packing donation boxes', category: 'Content' },
  { id: 'hashtags', name: 'Generate Hashtags', description: 'Get a set of relevant, trending hashtags.', icon: 'Hash', placeholder: 'e.g. Ramadan charity drive for underprivileged families', category: 'Social' },
  { id: 'campaign-ideas', name: 'Generate Campaign Ideas', description: 'Brainstorm fresh campaign concepts.', icon: 'Lightbulb', placeholder: 'e.g. A campaign to recruit university student volunteers', category: 'Content' },
  { id: 'content-calendar', name: 'Generate Content Calendar', description: 'Build a week of content ideas instantly.', icon: 'CalendarDays', placeholder: 'e.g. One week of content for our youth summit campaign', category: 'Content' },
  { id: 'rewrite', name: 'Rewrite Content', description: 'Rephrase and improve existing copy.', icon: 'Repeat', placeholder: 'Paste the text you want rewritten', category: 'Utility' },
  { id: 'translate', name: 'Translate Arabic ↔ English', description: 'Translate content between Arabic and English.', icon: 'Languages', placeholder: 'Paste text to translate', category: 'Utility' },
  { id: 'email', name: 'Generate Email', description: 'Draft a professional email in seconds.', icon: 'Mail', placeholder: 'e.g. Email sponsors thanking them for their support', category: 'Utility' },
  { id: 'announcement', name: 'Generate Announcement', description: 'Craft a clear organizational announcement.', icon: 'Megaphone', placeholder: 'e.g. Announce the new office hours starting next month', category: 'Content' },
  { id: 'linkedin-post', name: 'Generate LinkedIn Post', description: 'Professional post tailored for LinkedIn.', icon: 'Linkedin', placeholder: 'e.g. Share our quarterly impact milestones', category: 'Social' },
  { id: 'instagram-caption', name: 'Generate Instagram Caption', description: 'Catchy caption optimized for Instagram.', icon: 'Instagram', placeholder: 'e.g. Photo dump from our community event', category: 'Social' },
  { id: 'x-post', name: 'Generate X Post', description: 'Concise, punchy post for X (Twitter).', icon: 'Twitter', placeholder: 'e.g. Quick update on campaign progress', category: 'Social' },
  { id: 'tiktok-caption', name: 'Generate TikTok Caption', description: 'Trendy caption with hook for TikTok.', icon: 'Music2', placeholder: 'e.g. Behind the scenes video of our design team', category: 'Social' },
  { id: 'cta', name: 'Generate Call-to-Action', description: 'Compelling CTA lines for any campaign.', icon: 'MousePointerClick', placeholder: 'e.g. Encourage people to donate before the deadline', category: 'Content' },
  { id: 'seo-title', name: 'Generate SEO Title', description: 'Search-optimized titles for articles.', icon: 'Search', placeholder: 'e.g. Article about volunteering benefits for students', category: 'SEO' },
  { id: 'seo-description', name: 'Generate SEO Description', description: 'Meta description optimized for search.', icon: 'FileSearch', placeholder: 'e.g. Landing page for our annual fundraising gala', category: 'SEO' },
];
