/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#09090B',
        'secondary-bg': '#141319',
        'tertiary-bg': '#17171C',
      },
    } ,
  },
  plugins: [],
}