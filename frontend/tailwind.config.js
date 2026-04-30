/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        marca: {
          50: '#eef7f6',
          100: '#d5ece8',
          200: '#acd9d2',
          300: '#80c3b8',
          400: '#53aa9d',
          500: '#388f83',
          600: '#2f736b',
          700: '#295d57',
          800: '#244b47',
          900: '#223f3c'
        },
        acento: {
          100: '#fff2d8',
          300: '#ffd27b',
          500: '#e89b25'
        }
      },
      boxShadow: {
        panel: '0 18px 60px rgba(34, 63, 60, 0.12)'
      }
    }
  },
  plugins: []
};
