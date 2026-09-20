import type { AiToolId } from '@/types';

// Mock AI generation layer. Swap the body of `generate` for a real API call
// (e.g. fetch to an LLM endpoint) later without changing any call sites.

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hashPrompt(prompt: string): number {
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash * 31 + prompt.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const generators: Record<AiToolId, (prompt: string) => string> = {
  'social-post': (p) =>
    `🌟 ${p}\n\nWe're excited to share this with our community! Join us as we bring this to life together. Every step forward is made possible by people like you.\n\n#CapsuleMedia #Community #MakingAnImpact`,
  caption: (p) =>
    `${p} — captured in a moment that says more than words ever could. ✨`,
  hashtags: (p) => {
    const words = p.split(/\s+/).filter((w) => w.length > 3).slice(0, 6);
    const tags = words.map((w) => `#${w.replace(/[^a-zA-Z0-9]/g, '')}`);
    return [...new Set(['#CapsuleMedia', '#Community', '#Impact', ...tags])].join(' ');
  },
  'campaign-ideas': (p) =>
    `Here are 3 campaign concepts for "${p}":\n\n1. "Stories of Impact" — a testimonial series spotlighting real beneficiaries.\n2. "72-Hour Challenge" — a time-boxed push with daily social milestones.\n3. "Behind the Cause" — a behind-the-scenes docu-style content arc across Reels and TikTok.`,
  'content-calendar': (p) =>
    `7-Day Content Plan for "${p}":\n\nMon — Teaser post (Instagram)\nTue — Explainer carousel (LinkedIn)\nWed — Behind-the-scenes Reel (Instagram/TikTok)\nThu — Community testimonial (Facebook)\nFri — Countdown post (X)\nSat — Highlight recap video (YouTube)\nSun — Thank-you post + CTA (All platforms)`,
  rewrite: (p) =>
    `Here's a refined version:\n\n"${p.trim().replace(/\s+/g, ' ')}" — reworked for clarity, warmth, and a stronger call to action.`,
  translate: (p) => {
    const looksArabic = /[؀-ۿ]/.test(p);
    return looksArabic
      ? `English translation:\n\n"${p}" translated into clear, natural English preserving tone and intent.`
      : `الترجمة العربية:\n\n"${p}" مترجمة إلى العربية بأسلوب واضح وطبيعي مع الحفاظ على المعنى والنبرة.`;
  },
  email: (p) =>
    `Subject: ${p}\n\nDear Team,\n\nI hope this message finds you well. ${p}\n\nThank you for your continued dedication and support.\n\nBest regards,\nCapsule Media Team`,
  announcement: (p) =>
    `📢 Announcement\n\n${p}\n\nWe wanted to share this update directly with you. As always, feel free to reach out with any questions.`,
  'linkedin-post': (p) =>
    `${p}\n\nAt Capsule Media, we believe progress happens when people come together with purpose. Proud to share this milestone with our network.\n\n#Leadership #Community #Growth`,
  'instagram-caption': (p) =>
    `${p} 💜\nSwipe to see more, and tag someone who needs to see this today.\n\n#CapsuleMedia #Community`,
  'x-post': (p) => `${p.slice(0, 200)} 🔗 Learn more on our site. #CapsuleMedia`,
  'tiktok-caption': (p) => `wait for it... 👀 ${p} #fyp #CapsuleMedia #BehindTheScenes`,
  cta: (p) =>
    pick(
      [
        `Don't wait — ${p} Get involved today.`,
        `${p} Join us now and be part of the change.`,
        `Ready to make a difference? ${p}`,
      ],
      hashPrompt(p),
    ),
  'seo-title': (p) =>
    `${p} — A Complete Guide | Capsule Media`,
  'seo-description': (p) =>
    `Discover everything about ${p.toLowerCase()}. Learn key insights, practical tips, and how Capsule Media is driving impact in this space.`,
};

export async function generateAiContent(toolId: AiToolId, prompt: string): Promise<string> {
  const trimmed = prompt.trim();
  if (!trimmed) return '';
  // Simulated network latency for a realistic feel.
  await new Promise((resolve) => setTimeout(resolve, 600 + (hashPrompt(trimmed) % 500)));
  const generator = generators[toolId];
  return generator ? generator(trimmed) : `Generated content based on: "${trimmed}"`;
}
