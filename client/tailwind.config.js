/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBackground: "#121212",
        darkSurface: "#1F1A24",
      },
      fontFamily: {
        montserrat: ["Montserrat"],
      },
    },
  },

  plugins: [require("flowbite/plugin")],
};
