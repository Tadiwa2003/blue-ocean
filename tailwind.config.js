/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2fbff',
          100: '#d5f3ff',
          200: '#aee7ff',
          300: '#7ad9ff',
          400: '#45c4fb',
          500: '#1da0e6',
          600: '#117ec1',
          700: '#105f94',
          800: '#0f4c74',
          900: '#103f5f',
          950: '#08263b',
        },
        midnight: '#040b18',
        ocean: '#0b233e',
      },
      gradientColorStops: {
        ocean: {
          start: '#0b233e',
          middle: '#0e3a64',
          end: '#1da0e6',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 25px 60px -22px rgba(29, 160, 230, 0.55)',
      },
    },
  },
  plugins: [],
};
