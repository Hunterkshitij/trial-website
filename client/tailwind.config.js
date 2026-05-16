/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#007BFF',
        'brand-light': '#E6F2FF',
      }
    },
  },
  plugins: [],
}