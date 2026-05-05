/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B3B5A",
        secondary: "#06B6D4",
        accent: "#10B981",
        "medical-dark": "#0F172A",
        "medical-light": "#F8FAFC",
        "text-primary": "#111827",
        "text-secondary": "#64748B",
        danger: "#EF4444",
        tan: "#EDD5B3",
        healthcare: {
          blue: '#1B3B5A',
          cyan: '#06B6D4',
          teal: '#10B981',
          dark: '#0F172A',
          light: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 50px -12px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
