// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Si tienes un index.html en la raíz
    "./src/**/*.{js,jsx,ts,tsx}", // Escanea todos los archivos en src con JS, JSX, TS y TSX
  ],
  theme: {
    extend: {
      animation: {
        expandSubMenu: "expandSubMenu 0.3s ease-in-out",
      },
      keyframes: {
        expandSubMenu: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
