/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--pw-bg-brand) / <alpha-value>)',
          50: 'rgb(var(--pw-brand-50) / <alpha-value>)', 100: 'rgb(var(--pw-brand-100) / <alpha-value>)', 200: 'rgb(var(--pw-brand-200) / <alpha-value>)',
          300: 'rgb(var(--pw-brand-300) / <alpha-value>)', 400: 'rgb(var(--pw-brand-400) / <alpha-value>)', 500: 'rgb(var(--pw-brand-500) / <alpha-value>)',
          600: 'rgb(var(--pw-brand-600) / <alpha-value>)', 700: 'rgb(var(--pw-brand-700) / <alpha-value>)', 800: 'rgb(var(--pw-brand-800) / <alpha-value>)',
          900: 'rgb(var(--pw-brand-900) / <alpha-value>)',
          hover: 'rgb(var(--pw-bg-brand-hover) / <alpha-value>)', active: 'rgb(var(--pw-bg-brand-active) / <alpha-value>)', subtle: 'rgb(var(--pw-bg-brand-subtle) / <alpha-value>)',
        },
        accent: { DEFAULT: 'rgb(var(--pw-accent-500) / <alpha-value>)', light: 'rgb(var(--pw-accent-400) / <alpha-value>)', 300: 'rgb(var(--pw-accent-300) / <alpha-value>)', 600: 'rgb(var(--pw-accent-600) / <alpha-value>)' },
        page: 'rgb(var(--pw-bg-page) / <alpha-value>)',
        surface: { DEFAULT: 'rgb(var(--pw-bg-surface) / <alpha-value>)', raised: 'rgb(var(--pw-bg-surface-raised) / <alpha-value>)' },
        deep: 'rgb(var(--pw-bg-deep) / <alpha-value>)',
        muted: 'rgb(var(--pw-text-muted) / <alpha-value>)',
        redcorner: 'rgb(255 92 104 / <alpha-value>)',
        bluecorner: 'rgb(92 156 255 / <alpha-value>)',
        success: 'rgb(var(--pw-success-500) / <alpha-value>)', danger: 'rgb(var(--pw-danger-500) / <alpha-value>)', warning: 'rgb(var(--pw-warning-500) / <alpha-value>)',
      },
      textColor: {
        default: 'rgb(var(--pw-text-default) / <alpha-value>)', muted: 'rgb(var(--pw-text-muted) / <alpha-value>)', subtle: 'rgb(var(--pw-text-subtle) / <alpha-value>)',
        brand: 'rgb(var(--pw-text-brand) / <alpha-value>)', 'on-brand': 'rgb(var(--pw-text-on-brand) / <alpha-value>)', 'on-deep': 'rgb(var(--pw-text-on-deep) / <alpha-value>)',
        success: 'rgb(var(--pw-success-500) / <alpha-value>)', danger: 'rgb(var(--pw-danger-500) / <alpha-value>)', warning: 'rgb(var(--pw-warning-500) / <alpha-value>)',
      },
      borderColor: {
        DEFAULT: 'rgb(var(--pw-border-default) / <alpha-value>)', default: 'rgb(var(--pw-border-default) / <alpha-value>)',
        strong: 'rgb(var(--pw-border-strong) / <alpha-value>)', brand: 'rgb(var(--pw-border-brand) / <alpha-value>)',
        danger: 'rgb(var(--pw-danger-500) / <alpha-value>)',
      },
      ringColor: { focus: 'rgb(var(--pw-focus-ring) / <alpha-value>)', brand: 'rgb(var(--pw-border-brand) / <alpha-value>)' },
      ringOffsetColor: { page: 'rgb(var(--pw-bg-page) / <alpha-value>)', deep: 'rgb(var(--pw-bg-deep) / <alpha-value>)' },
      boxShadow: {
        100: 'var(--pw-shadow-100)', 200: 'var(--pw-shadow-200)', 300: 'var(--pw-shadow-300)',
        400: 'var(--pw-shadow-400)', 500: 'var(--pw-shadow-500)', 600: 'var(--pw-shadow-600)',
        cta: 'var(--pw-shadow-cta)',
      },
      borderRadius: {
        sm: 'var(--pw-radius-sm)', md: 'var(--pw-radius-md)', lg: 'var(--pw-radius-lg)',
        xl: 'var(--pw-radius-xl)', '2xl': 'var(--pw-radius-2xl)', '3xl': 'var(--pw-radius-3xl)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'ticker': 'ticker 38s linear infinite',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        ticker: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
