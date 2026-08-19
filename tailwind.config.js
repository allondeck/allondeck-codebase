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
          "dark-alt": "#052631",
          navy: "#044155",
          medium: "#066175",
          light: "#76abbf",
          cream: "#ffe3c5",
          orange: "#e98e2e",
        }
      },
      maxWidth: {
        content: "1400px",
      }
    },
  },
  plugins: [],
}
