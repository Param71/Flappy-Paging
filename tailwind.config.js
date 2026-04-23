/** @type {import('tailwindcss').Config} */ 
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0A',
        cyber: '#A3FF00',
        offwhite: '#F5F5F0',
        slate: '#6B7280',
        deep: '#111111'
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
