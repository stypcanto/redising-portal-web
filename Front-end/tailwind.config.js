// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        expandSubMenu: 'expandSubMenu 0.3s ease-in-out', // Animación para el submenú
      },
      keyframes: {
        expandSubMenu: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)', // Comienza desde arriba
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)', // Se posiciona normalmente
          },
        },
      },
    },
  },
  plugins: [],
}


