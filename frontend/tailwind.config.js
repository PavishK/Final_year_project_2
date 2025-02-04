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
        'footer-color':'#F9F9F9',
        'footer-text':'#777777',
        'items-color':'#F4F4F4',
      },
      fontFamily: {
        arvo: ['"Arvo"', 'serif'],
        pacifico:['"Pacifico"', 'serif'],
      },
      screens:{
        mobile_nav:{'max':'680px'},

      },
      width:{
        landing_img:'750px',
        l_p2:'900px',
        bsp:'320px',
        disp_img:'600px',
        disp_product:'455px',
      },
      height:{
        l_p2:'400px',
        disp_image:'520px'
      }
    },
  },
  plugins: [],
}

