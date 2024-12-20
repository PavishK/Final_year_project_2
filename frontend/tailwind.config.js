/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        spin: 'spin 1s linear infinite',
      },
      colors: {
        'h-t-color': '#F5952C',
      },
      fontFamily: {
        arvo: ['"Arvo"', 'serif'],
      },
      screens:{
        mobile_nav:{'max':'680px'},

      },
      width:{
        landing_img:'750px',
      },
    },
  },
  plugins: [],
}

