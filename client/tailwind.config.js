/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#58CC02', // Feather Green
          hover: '#46a302', // Slightly darker for hover states
          active: '#3a8501',
        },
        secondary: {
          DEFAULT: '#1CB0F6', // Macaw
        },
        duo: {
          green: '#58CC02', // Feather Green
          'mask-green': '#89E219',
          eel: '#4B4B4B',
          snow: '#FFFFFF',
          macaw: '#1CB0F6',
          cardinal: '#FF4B4B',
          bee: '#FFC800',
          fox: '#FF9600',
          beetle: '#CE82FF',
          humpback: '#2B70C9',
          wolf: '#777777',
          hare: '#AFAFAF',
          swan: '#E5E5E5',
          polar: '#F7F7F7',
        }
      },
      fontFamily: {
        sans: ['"Nunito"', '"DIN Round"', 'sans-serif'], // Approximating Duolingo's font style
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem', // Duolingo uses very rounded corners
      },
      boxShadow: {
        'b-2': '0 2px 0',
        'b-4': '0 4px 0', // Duolingo button style
      }
    },
  },
  plugins: [],
}
