/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'h-t-color': '#F5952C',
      },
      fontFamily: {
        arvo: ['"Arvo"', 'serif'],
      },
      screens:{
        mobile_nav:{'max':'680px'},
      }
    },
  },
  plugins: [],
}

