/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				'50': '#f2f2f2',
  				'100': '#e6e6e6',
  				'200': '#cccccc',
  				'300': '#b3b3b3',
  				'400': '#1B98E0',
  				'500': '#1785C7',
  				'600': '#1580b8',
  				'700': '#0f6890',
  				'800': '#0a5068',
  				'900': '#053840',
  				'950': '#0A192F'
  			},
  			midnight: '#0A192F',
  			ocean: '#0A192F',
  			softGray: '#F2F2F2',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		gradientColorStops: {
  			ocean: {
  				start: '#0A192F',
  				middle: '#0A192F',
  				end: '#1B98E0'
  			}
  		},
  		fontFamily: {
  			display: [
  				'Poppins',
  				'ui-sans-serif',
  				'system-ui'
  			],
  			body: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui'
  			]
  		},
  		boxShadow: {
  			glow: '0 25px 60px -22px rgba(29, 160, 230, 0.55)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
