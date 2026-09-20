import type { Post, PostStatus, SocialPlatform } from '@/types';

const platforms: SocialPlatform[] = [
  'Instagram',
  'X',
  'LinkedIn',
  'TikTok',
  'Facebook',
  'YouTube',
];

const statuses: PostStatus[] = [
  'Draft',
  'Review',
  'Approved',
  'Scheduled',
  'Published',
  'Rejected',
];

const authors = ['u2', 'u3', 'u7', 'u8'];
const campaignIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

const titles = [
  'Behind the scenes at our giving drive',
  'Meet this year\'s youth leaders',
  'Open day countdown begins',
  'Our new look, same mission',
  'Volunteers make it happen',
  'Impact report: the numbers that matter',
  'Community spotlight: local heroes',
  'Five ways to get involved this month',
  '3 lessons from our latest campaign',
  'Thank you to our amazing sponsors',
  'A day in the life of our field team',
  'Announcing our newest partnership',
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const posts: Post[] = Array.from({ length: 36 }).map((_, i) => {
  const platform = platforms[i % platforms.length];
  const status = statuses[i % statuses.length];
  const day = 1 + (i % 27);
  const month = 1 + Math.floor(i / 12) % 6;
  const rand = seededRandom(i + 1);
  const isPublished = status === 'Published';
  return {
    id: `p${i + 1}`,
    title: titles[i % titles.length],
    caption: `${titles[i % titles.length]} — join us as we share more about this initiative and how you can be part of it. #CapsuleMedia`,
    platform,
    status,
    scheduledAt: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${9 + (i % 8)}:00:00`,
    authorId: authors[i % authors.length],
    campaignId: campaignIds[i % campaignIds.length],
    mediaUrl: `https://picsum.photos/seed/capsule${i}/600/400`,
    hashtags: ['#Community', '#Impact', `#${platform}`],
    metrics: isPublished
      ? {
          likes: Math.round(rand * 4000) + 120,
          comments: Math.round(rand * 300) + 8,
          shares: Math.round(rand * 200) + 4,
          reach: Math.round(rand * 60000) + 2000,
        }
      : undefined,
  };
});

export const getPostById = (id: string): Post | undefined =>
  posts.find((p) => p.id === id);
