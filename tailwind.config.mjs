import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [tailwindcssAnimate, typography],
  prefix: '',
  safelist: [
    'lg:col-span-1',
    'lg:col-span-2',
    'lg:col-span-3',
    'lg:col-span-4',
    'lg:col-span-5',
    'lg:col-span-6',
    'lg:col-span-7',
    'lg:col-span-8',
    'lg:col-span-9',
    'lg:col-span-10',
    'lg:col-span-11',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '106rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '100rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
        //   DEFAULT: 'hsl(var(--primary))',
        //   foreground: 'hsl(var(--primary-foreground))',
            yellow: {
                DEFAULT: '#fcc707',
                mid:'#ffd644',
                light: '#ffe895'
            },
            dark: {
                DEFAULT: '#292929',
                900:'#222222',
                800: '#18181a',
                gray: '#575656'
            }
        },
        ring: 'hsl(var(--ring))',
        secondary: {
        //   DEFAULT: 'hsl(var(--secondary))',
        //   foreground: 'hsl(var(--secondary-foreground))',
            blue:{
                DEFAULT:'#2d335d',
                light:'#dfe8ff'
            },
            pink:{
                DEFAULT:'#d9456a',
                light:'#ffa5ae'
            }
        },
        tertiary: {
            white: {
                '100': 'rgba(255, 255, 255, .10)',
                '200': 'rgba(255, 255, 255, .20)',
                '300': 'rgba(255, 255, 255, .30)',
                '400': 'rgba(255, 255, 255, .40)',
                '500': 'rgba(255, 255, 255, .50)',
                '600': 'rgba(255, 255, 255, .60)',
                '700': 'rgba(255, 255, 255, .70)',
                '800': 'rgba(255, 255, 255, .80)',
                '900': 'rgba(255, 255, 255, .90)',
                '999': 'rgba(255, 255, 255, 1)',
                DEFAULT: 'rgba(255, 255, 255, 1)'
            },
            black: {
                '100': 'rgba(0, 0, 0, .10)',
                '200': 'rgba(0, 0, 0, .20)',
                '300': 'rgba(0, 0, 0, .30)',
                '400': 'rgba(0, 0, 0, .40)',
                '500': 'rgba(0, 0, 0, .50)',
                '600': 'rgba(0, 0, 0, .60)',
                '700': 'rgba(0, 0, 0, .70)',
                '800': 'rgba(0, 0, 0, .80)',
                '900': 'rgba(0, 0, 0, .90)',
                '999': 'rgba(0, 0, 0, 1)',
                DEFAULT: 'rgba(0, 0, 0, 1)'
            },
            gray: {
                '0': '#ffffff',
                '100': '#dedede',
                '200': '#c9c9c9',
                '300': '#B3B3B3',
                '400': '#9B9B9B',
                '500': '#7d7d7d',
                '600': '#5e5e5e',
                '700': '#525252',
                '800': '#404040',
                '900': '#292929',
                '999': '#000000',
                DEFAULT: '#7d7d7d'
            }
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
        inter: ['var(--font-inter)'],
        "funnel-sans": ['var(--font-funnel-sans)']
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '3rem',
              },
              h2: {
                fontSize: '2.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
