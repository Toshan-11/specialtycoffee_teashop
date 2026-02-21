import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: 'rgb(var(--brand-black) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark) / <alpha-value>)',
          charcoal: 'rgb(var(--brand-charcoal) / <alpha-value>)',
          gray: 'rgb(var(--brand-gray) / <alpha-value>)',
          muted: 'rgb(var(--brand-muted) / <alpha-value>)',
          light: 'rgb(var(--brand-light) / <alpha-value>)',
          cream: 'rgb(var(--brand-cream) / <alpha-value>)',
          gold: 'rgb(var(--brand-gold) / <alpha-value>)',
          'gold-light': 'rgb(var(--brand-gold-light) / <alpha-value>)',
          'gold-dark': 'rgb(var(--brand-gold-dark) / <alpha-value>)',
          white: 'rgb(var(--brand-white) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;