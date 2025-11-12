/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f2f2',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#1B98E0',
          500: '#1B98E0',
          600: '#1580b8',
          700: '#0f6890',
          800: '#0a5068',
          900: '#053840',
          950: '#0A192F',
        },
        midnight: '#0A192F',
        ocean: '#0A192F',
        softGray: '#F2F2F2',
      },
      gradientColorStops: {
        ocean: {
          start: '#0A192F',
          middle: '#0A192F',
          end: '#1B98E0',
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
