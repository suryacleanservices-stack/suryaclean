/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#F5A623',
        blue: '#4A90D9',
        navy: '#1B2A4A',
        green: '#27AE60',
      },
    },
  },
  plugins: [],
};