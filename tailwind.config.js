/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          bg: '#F7F3EC',
          primary: '#E8DDCC',
          surface: '#FFFFFF',
          text: '#171513',
          muted: '#6E675F',
          dark: '#40372F',
          accent: '#A78663',
          energy: '#78806B',
          'energy-light': '#E8EFE5',
          'status-available': '#4A7C59',
          'status-busy': '#C87D32',
          'status-unavailable': '#9B3838',
          'status-unknown': '#6E675F',
        }
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
        display: ['var(--font-sora)', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(23, 21, 19, 0.04)',
        'elevated': '0 10px 30px rgba(23, 21, 19, 0.08)',
        'glow-energy': '0 0 20px rgba(120, 128, 107, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
