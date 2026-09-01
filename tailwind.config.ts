import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['El Messiri', 'Amiri', 'Traditional Arabic', 'serif'],
        body: ['IBM Plex Sans Arabic', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      colors: {
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
          300: 'var(--ink-300)',
        },
        line: {
          DEFAULT: 'var(--line)',
          soft: 'var(--line-soft)',
          strong: 'var(--line-strong)',
        },
        paper: {
          DEFAULT: 'var(--paper)',
          alt: 'var(--paper-alt)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
        },
        teal: {
          900: 'var(--teal-900)',
          700: 'var(--teal-700)',
          600: 'var(--teal-600)',
          500: 'var(--teal-500)',
          tint: 'var(--teal-tint)',
          tintStrong: 'var(--teal-tint-strong)',
        },
        palm: {
          700: 'var(--palm-700)',
          500: 'var(--palm-500)',
          tint: 'var(--palm-tint)',
        },
        sand: {
          700: 'var(--sand-700)',
          600: 'var(--sand-600)',
          500: 'var(--sand-500)',
          tint: 'var(--sand-tint)',
        },
        crit: {
          700: 'var(--crit-700)',
          600: 'var(--crit-600)',
          tint: 'var(--crit-tint)',
        },
        success: {
          700: 'var(--success-700)',
          600: 'var(--success-600)',
          tint: 'var(--success-tint)',
        },
        cat: {
          study: 'var(--cat-study)',
          work: 'var(--cat-work)',
          project: 'var(--cat-project)',
          personal: 'var(--cat-personal)',
          general: 'var(--cat-general)',
        },
        pr: {
          high: 'var(--pr-high)',
          highTint: 'var(--pr-high-tint)',
          med: 'var(--pr-med)',
          medTint: 'var(--pr-med-tint)',
          low: 'var(--pr-low)',
          lowTint: 'var(--pr-low-tint)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        frame: 'var(--shadow-frame)',
        pop: 'var(--shadow-pop)',
      },
    },
  },
  plugins: [],
} satisfies Config
