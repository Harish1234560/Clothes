/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="ink"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          0: 'rgb(var(--bg-0) / <alpha-value>)',
          1: 'rgb(var(--bg-1) / <alpha-value>)',
          2: 'rgb(var(--bg-2) / <alpha-value>)',
          3: 'rgb(var(--bg-3) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--text-1) / <alpha-value>)',
          soft: 'rgb(var(--text-2) / <alpha-value>)',
          faint: 'rgb(var(--text-3) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
        },
        success: 'rgb(var(--success) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label': ['11px', { letterSpacing: '0.28em', lineHeight: '1' }],
        'hero': ['clamp(52px, 9vw, 140px)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'h2': ['clamp(34px, 5vw, 68px)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h3': ['28px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'body': ['16px', { lineHeight: '1.7' }],
      },
      spacing: {
        '128': '128px',
        '80': '80px',
        '18': '72px',
      },
      borderRadius: {
        '12': '12px',
        '20': '20px',
        '28': '28px',
      },
      maxWidth: {
        'shell': '1320px',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(22,19,15,0.08), 0 4px 16px -4px rgba(22,19,15,0.06)',
        'card': '0 4px 24px -8px rgba(22,19,15,0.12), 0 1px 4px -1px rgba(22,19,15,0.06)',
        'float': '0 12px 48px -16px rgba(22,19,15,0.18), 0 2px 8px -2px rgba(22,19,15,0.08)',
        'book': '0 8px 32px -12px rgba(22,19,15,0.25), 0 2px 8px -4px rgba(22,19,15,0.10)',
        'gold': '0 4px 24px -8px rgba(184,137,59,0.30)',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '450': '450ms',
        '800': '800ms',
        '1000': '1000ms',
      },
      keyframes: {
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'draw-line': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'loop-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(12px)' },
        },
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'draw-line': 'draw-line 1.2s ease-out forwards',
        'loop-scroll': 'loop-scroll 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
