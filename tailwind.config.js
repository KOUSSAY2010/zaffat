/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#faf8f5",
          ivory: "#f5f0e6",
          card: "#ffffff",
          cardHover: "#fdfbf7",
          border: "#eedfc0",
          borderSoft: "#f3ead9",
          text: {
            primary: "#1c1917",
            secondary: "#44403c",
            muted: "#78716c",
            light: "#a8a29e",
          },
          gold: {
            light: "#fef08a",
            DEFAULT: "#c99a2c",
            dark: "#99731b",
            rich: "#b8860b",
            soft: "#fbf3db",
          },
          rose: {
            light: "#ffe4e6",
            DEFAULT: "#e11d48",
            soft: "#fff1f2",
            accent: "#f43f5e",
          }
        }
      },
      fontFamily: {
        rakkas: ["Rakkas", "cursive", "serif"],
        amiri: ["Amiri", "serif"],
        cairo: ["Cairo", "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(201, 154, 44, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(201, 154, 44, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'gold-glow': '0 0 20px rgba(201, 154, 44, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite alternate',
        'wave': 'wave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%': { height: '20%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
