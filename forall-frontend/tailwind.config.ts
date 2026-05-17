import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#0F172A',
          light: '#1E3A5F',
          dark: '#0B1220',
        },
        black: {
          DEFAULT: '#FFFBF5',
          2: '#F5F1EA',
          3: '#EAE4DB',
          4: '#D9D1C7',
        },
        surface: '#F5F1EA',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse at 50% 0%, rgba(20,184,166,0.16) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

export default config
