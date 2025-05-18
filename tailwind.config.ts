
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				library: {
					brown: '#654321',
					darkBrown: '#3E2723',
					cream: '#F7F2EA',
					gold: '#D4AF37',
					burgundy: '#9E1C47',
					wood: '#8B5A2B',
					tan: '#D2B48C',
					paper: '#FFF8E1',
					leather: '#A67B5B'
				},
				// Spectral palette colors with unique values for each score
				spectral: {
					0: '#CCCCCC', // Score 0: Grey (lowest)
					1: '#E06666', // Score 1: Pink-Red
					2: '#E67C43', // Score 2: Orange-Red
					3: '#F1C232', // Score 3: Orange-Yellow
					4: '#FFD966', // Score 4: Yellow
					5: '#DFF2A9', // Score 5: Light Green-Yellow
					6: '#9FC686', // Score 6: Light Green
					7: '#76A5AF', // Score 7: Teal
					8: '#6D9EEB', // Score 8: Blue
					9: '#9E1C47'  // Score 9-10: Burgundy/Red (highest)
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			backgroundImage: {
				'library-pattern': "url('/lovable-uploads/7e41acec-b173-4232-a387-589b2d74601a.png')",
				'vintage-books': "url('/lovable-uploads/74961daf-7933-4260-96ee-8aacd1dab403.png')",
				'paper-texture': "url('/lovable-uploads/3a64a615-4c7f-4e2b-94a0-81f494bd575a.png')"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
