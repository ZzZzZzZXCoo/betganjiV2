/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a3069',
        secondary: '#10b981',
        'bet-win': '#10b981',
        'bet-draw': '#f59e0b',
        'bet-loss': '#ef4444',
        background: '#f8fafc',
        foreground: '#0f172a',
      },
    },
  },
  plugins: [],
}