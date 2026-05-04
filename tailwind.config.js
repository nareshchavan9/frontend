/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        healthcare: {
          blue: '#2D3FE2',
          teal: '#00D1C1',
          dark: '#1A1C20',
          light: '#F4F7FE'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 20px 50px -12px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
