/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ["Aquatico", "sans-serif"],
        sans: ["Nunito", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#044155",
          medium: "#066175",
          light: "#76abbf",
          cream: "#f6ebd4",
          orange: "#e38622",
        }
      }
    },
  },
  plugins: [],
}
