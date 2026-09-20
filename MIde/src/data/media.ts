import type { MediaAsset, MediaType } from '@/types';

const items: Array<{ name: string; type: MediaType; category: string; folder: string; tags: string[] }> = [
  { name: 'Giving Drive Hero.jpg', type: 'image', category: 'Campaign', folder: 'Campaigns/Ramadan', tags: ['hero', 'campaign'] },
  { name: 'Summit Highlight Reel.mp4', type: 'video', category: 'Campaign', folder: 'Campaigns/Summit', tags: ['video', 'reel'] },
  { name: 'Brand Guidelines 2026.pdf', type: 'document', category: 'Brand', folder: 'Brand/Guidelines', tags: ['brand', 'guidelines'] },
  { name: 'Capsule Logo Primary.svg', type: 'logo', category: 'Brand', folder: 'Brand/Logos', tags: ['logo', 'primary'] },
  { name: 'Capsule Logo White.svg', type: 'logo', category: 'Brand', folder: 'Brand/Logos', tags: ['logo', 'white'] },
  { name: 'Icon Set - Social.svg', type: 'icon', category: 'Icons', folder: 'Brand/Icons', tags: ['icons', 'social'] },
  { name: 'Open Day Poster Draft.jpg', type: 'image', category: 'Design', folder: 'Design/Posters', tags: ['poster', 'draft'] },
  { name: 'Volunteer Interview.mp4', type: 'video', category: 'Content', folder: 'Content/Interviews', tags: ['interview', 'volunteer'] },
  { name: 'Sponsor Agreement.docx', type: 'document', category: 'Legal', folder: 'Documents/Legal', tags: ['legal', 'sponsor'] },
  { name: 'Rebrand Moodboard.jpg', type: 'image', category: 'Brand', folder: 'Brand/Moodboards', tags: ['moodboard', 'brand'] },
  { name: 'Team Retreat Photos.zip', type: 'document', category: 'Team', folder: 'Team/Events', tags: ['team', 'event'] },
  { name: 'Product Shot 01.jpg', type: 'image', category: 'Product', folder: 'Media/Products', tags: ['product'] },
  { name: 'Campaign Jingle.mp3', type: 'video', category: 'Audio', folder: 'Media/Audio', tags: ['audio', 'jingle'] },
  { name: 'Icon Set - UI.svg', type: 'icon', category: 'Icons', folder: 'Brand/Icons', tags: ['icons', 'ui'] },
  { name: 'Annual Report Cover.jpg', type: 'image', category: 'Design', folder: 'Design/Reports', tags: ['report', 'cover'] },
  { name: 'Explainer Video Draft.mp4', type: 'video', category: 'Content', folder: 'Content/Explainers', tags: ['video', 'draft'] },
];

export const mediaAssets: MediaAsset[] = items.map((item, i) => ({
  id: `m${i + 1}`,
  name: item.name,
  type: item.type,
  url:
    item.type === 'image'
      ? `https://picsum.photos/seed/media${i}/800/600`
      : '#',
  thumbnailUrl:
    item.type === 'video' || item.type === 'image'
      ? `https://picsum.photos/seed/thumb${i}/300/200`
      : '',
  size: `${(1.2 + i * 0.4).toFixed(1)} MB`,
  tags: item.tags,
  category: item.category,
  folder: item.folder,
  uploadedBy: ['u2', 'u3', 'u4', 'u5', 'u6'][i % 5],
  uploadedAt: `2026-0${1 + (i % 6)}-${String(3 + i).padStart(2, '0')}`,
}));
