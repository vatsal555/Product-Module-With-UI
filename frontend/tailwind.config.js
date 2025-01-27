/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          text: '#f1f5f9',
          'text-secondary': '#94a3b8'
        },
        accent: {
          blue: '#60a5fa',
          purple: '#a78bfa',
          pink: '#f472b6',
          green: '#4ade80',
          yellow: '#facc15',
          red: '#f87171'
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 