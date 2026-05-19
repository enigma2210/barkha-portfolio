export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        deva: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      colors: {
        sky: {
          25: '#F0F7FF',
          50: '#E0EFFF',
          100: '#C7E1FF',
          200: '#93C5FD',
          300: '#60A5FA',
          400: '#3B9AE8',
          500: '#1E7ED4',
          600: '#1563B2',
          700: '#0E4D8F',
          800: '#093A6B',
          900: '#062850',
          950: '#031627',
        },
        gold: { DEFAULT: '#C59A4A', soft: '#E8D7AD' },
        ink: { DEFAULT: '#07111F' },
        ivory: { DEFAULT: '#F8F3E8', 2: '#FFF9EE' },
      },
      animation: {
        'pulse-dot': 'pulse 2.4s ease-in-out infinite',
        nudge: 'nudge 2.5s ease-in-out infinite',
        'ambient-drift': 'ambientDrift 14s ease-in-out infinite alternate',
        shimmer: 'galleryShimmer 1.45s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(59,154,232,0.4)' },
          '50%': { boxShadow: '0 0 0 6px rgba(59,154,232,0)' },
        },
        nudge: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        ambientDrift: {
          from: { transform: 'translate3d(0,0,0) scale(1)' },
          to: { transform: 'translate3d(28px,-22px,0) scale(1.08)' },
        },
        galleryShimmer: {
          '0%': { backgroundPosition: '180% 0,0 0' },
          '100%': { backgroundPosition: '-80% 0,0 0' },
        },
      },
    },
  },
  plugins: [],
};
