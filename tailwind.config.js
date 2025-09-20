const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./(app|src)/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-slow': 'float 25s ease-in-out infinite',
        'float-fast': 'float 15s ease-in-out infinite',
        'liquid-rotate': 'liquidRotate 30s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        liquidRotate: {
          '0%, 100%': { transform: 'translate(-25%, -25%) rotate(0deg)' },
          '33%': { transform: 'translate(-25%, -25%) rotate(120deg)' },
          '66%': { transform: 'translate(-25%, -25%) rotate(240deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      backgroundColor: {
        'white/10': 'rgba(255, 255, 255, 0.1)',
        'white/5': 'rgba(255, 255, 255, 0.05)',
        'black/30': 'rgba(0, 0, 0, 0.3)',
      },
      borderColor: {
        'white/20': 'rgba(255, 255, 255, 0.2)',
        'white/10': 'rgba(255, 255, 255, 0.1)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 12px 48px 0 rgba(31, 38, 135, 0.2)',
        'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      backdropSaturate: {
        '180': '1.8',
        '200': '2',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant, addUtilities, theme }) {
      // this class is applied to `html` by `src/util/theme-effect.ts`, similar
      // to how `dark:` gets enabled
      addVariant('theme-system', '.theme-system &');

      // Add glassmorphism utilities
      addUtilities({
        '.glass-card': {
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        '.glass-card-dark': {
          backgroundColor: 'rgba(28, 28, 28, 0.3)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        },
        '.glass-orb': {
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
        },
      });
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
