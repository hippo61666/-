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
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1', // Indigo-500 (主色调)
          600: '#4f46e5',
          900: '#312e81',
        },
        secondary: {
          500: '#8b5cf6', // Violet-500
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        dark: '#0f172a', // Slate-900
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
