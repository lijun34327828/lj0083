/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        lg: '2rem',
      },
    },
    extend: {
      colors: {
        forest: {
          50: '#f0f5f2',
          100: '#d9e5de',
          200: '#b4c9bd',
          300: '#86a794',
          400: '#5c8270',
          500: '#3d6352',
          600: '#2d4d3e',
          700: '#253f32',
          800: '#1A3A2A',
          900: '#132c20',
          950: '#0a1a12',
        },
        bronze: {
          50: '#fdf8e7',
          100: '#faefc8',
          200: '#f5de8d',
          300: '#eec64b',
          400: '#e9b023',
          500: '#d99514',
          600: '#bb710e',
          700: '#99520f',
          800: '#B8860B',
          900: '#8b6914',
          950: '#4a3728',
        },
        ivory: {
          50: '#fffffe',
          100: '#fffff5',
          200: '#FFFFF0',
          300: '#fef9e0',
          400: '#faf0be',
          500: '#f5e69a',
        },
        bark: {
          50: '#f8f5f2',
          100: '#ede6df',
          200: '#d9cabd',
          300: '#c1a892',
          400: '#a8866b',
          500: '#916c51',
          600: '#7a5643',
          700: '#63453a',
          800: '#4A3728',
          900: '#3d2e23',
          950: '#211711',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        'glow-bronze': '0 0 20px rgba(184, 134, 11, 0.3)',
        'glow-forest': '0 0 20px rgba(26, 58, 42, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
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
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
