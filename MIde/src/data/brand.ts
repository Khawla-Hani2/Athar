export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface BrandFont {
  name: string;
  role: string;
  sample: string;
  weights: string[];
}

export interface BrandTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

export const brandColors: BrandColor[] = [
  { name: 'Capsule Violet', hex: '#7c3aed', usage: 'Primary brand color, CTAs' },
  { name: 'Deep Violet', hex: '#45178c', usage: 'Headers, emphasis' },
  { name: 'Sky', hex: '#0ea5e9', usage: 'Links, secondary accents' },
  { name: 'Amber', hex: '#f59e0b', usage: 'Warnings, highlights' },
  { name: 'Emerald', hex: '#22c55e', usage: 'Success states' },
  { name: 'Slate', hex: '#334155', usage: 'Body text, neutral UI' },
  { name: 'Rose', hex: '#ec4899', usage: 'Community & volunteer content' },
];

export const brandFonts: BrandFont[] = [
  { name: 'Inter', role: 'Primary UI & body font', sample: 'The quick brown fox jumps over the lazy dog', weights: ['400', '500', '600', '700'] },
  { name: 'Poppins', role: 'Display & headline font', sample: 'Capsule Media OS', weights: ['500', '600', '700'] },
  { name: 'JetBrains Mono', role: 'Monospace / data', sample: '01234 56789', weights: ['400', '500'] },
];

export const brandTemplates: BrandTemplate[] = [
  { id: 'bt1', name: 'Instagram Post Template', category: 'Social', thumbnail: 'https://picsum.photos/seed/tmpl1/400/400' },
  { id: 'bt2', name: 'Story Template', category: 'Social', thumbnail: 'https://picsum.photos/seed/tmpl2/300/500' },
  { id: 'bt3', name: 'LinkedIn Banner Template', category: 'Social', thumbnail: 'https://picsum.photos/seed/tmpl3/500/180' },
  { id: 'bt4', name: 'Event Poster Template', category: 'Print', thumbnail: 'https://picsum.photos/seed/tmpl4/350/450' },
  { id: 'bt5', name: 'Presentation Deck Template', category: 'Docs', thumbnail: 'https://picsum.photos/seed/tmpl5/500/300' },
  { id: 'bt6', name: 'Email Newsletter Template', category: 'Email', thumbnail: 'https://picsum.photos/seed/tmpl6/450/500' },
];

export const brandGuidelines = [
  {
    title: 'Logo Usage',
    body: 'Maintain clear space equal to the logo mark height on all sides. Never stretch, recolor, or rotate the logo.',
  },
  {
    title: 'Color Application',
    body: 'Use Capsule Violet as the dominant brand color. Amber and Rose are reserved for accents and should never exceed 20% of a layout.',
  },
  {
    title: 'Typography',
    body: 'Use Poppins for headlines and Inter for body copy. Avoid mixing more than two typefaces in a single design.',
  },
  {
    title: 'Imagery Tone',
    body: 'Favor candid, natural-light photography over stock imagery. Avoid overly staged or corporate visuals.',
  },
];
