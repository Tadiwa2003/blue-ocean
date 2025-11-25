/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./pages/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./app/**/*.{js,jsx,ts,tsx}',
		'./src/**/*.{js,jsx,ts,tsx}'
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
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
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				fashion: {
					cream: 'hsl(var(--fashion-cream))',
					beige: 'hsl(var(--fashion-beige))',
					charcoal: 'hsl(var(--fashion-charcoal))',
					accent: 'hsl(var(--fashion-accent))',
					highlight: 'hsl(var(--fashion-highlight))'
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
				/* Premium Fashion Font Hierarchy */
				display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
				body: ['Inter', 'ui-sans-serif', 'system-ui'],
				serif: ['Playfair Display', 'Cormorant', 'serif'],
				sans: ['Manrope', 'Montserrat', 'sans-serif'],
				/* Fashion Forward Alternatives */
				elegant: ['Sohne', 'Outfit', 'sans-serif'],
				modern: ['Raleway', 'Space Grotesk', 'sans-serif'],
				/* Beauty & Spa Specific */
				beauty: ['Poppins', 'Montserrat', 'sans-serif'],
				luxury: ['Cormorant', 'Playfair Display', 'serif']
			},
			boxShadow: {
				glow: '0 25px 60px -22px rgba(29, 160, 230, 0.55)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 12px 2px rgba(255, 255, 255, 0.1)'
					},
					'50%': {
						boxShadow: '0 0 20px 4px rgba(255, 255, 255, 0.2)'
					}
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				shine: {
					'0%': { backgroundPosition: '200% 0' },
					'100%': { backgroundPosition: '-200% 0' }
				},
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
				float: 'float 6s ease-in-out infinite',
				shine: 'shine 3s linear infinite',
				fadeIn: 'fadeIn 0.7s ease-out forwards'
			},
			backdropFilter: {
				none: 'none',
				blur: 'blur(8px)'
			}
		}
	},
	plugins: [
		require('tailwindcss-animate'),
		function ({ addUtilities }) {
			addUtilities({
				'.animate-spotlight': {
					animation: 'spotlight 2s ease .75s 1 forwards'
				},
				'@keyframes spotlight': {
					'0%': {
						opacity: '0',
						transform: 'translate(-72%, -62%) scale(0.5)'
					},
					'100%': {
						opacity: '1',
						transform: 'translate(-50%,-40%) scale(1)'
					}
				}
			});
		}
	]
};
