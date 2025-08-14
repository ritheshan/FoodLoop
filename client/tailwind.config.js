/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        merriweather: ["Merriweather", "serif"],
        rouge: ["Rouge Script", "cursive"],
        Birthstone: ["Birthstone", "serif"],
      
      },
      colors: {
        colour1: '#FFA725', 
        colour2: '#FFF5E4', 
        colour3: '#C1D8C3', 
        colour4: '#6A9C89',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        scrollReverse: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'scroll-left': 'scroll 30s linear infinite',
        'scroll-right': 'scrollReverse 30s linear infinite',
        float: "float 3s ease-in-out infinite",
      },
    },

  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.custom-scrollbar::-webkit-scrollbar': {
          width: '8px',
        },
        '.custom-scrollbar::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          background: '#4ade80',
          borderRadius: '4px',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          background: '#38a169',
        },
        '.custom-scrollbar': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#4ade80 #f1f1f1',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
