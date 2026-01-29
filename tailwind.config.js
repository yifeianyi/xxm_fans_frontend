/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 自定义主题色
        'sage-bg': '#f2f9f1',
        'meadow-green': '#8eb69b',
        'peach-accent': '#f8b195',
        'butter-yellow': '#fff4d1',
        'earthy-brown': '#4a3728',
      },
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'noto-sans': ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}