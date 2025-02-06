import React from "react";
import menuIcon from "/images/home.png"; // Asegúrate de que esta imagen sea del ícono que deseas usar

const Nav_intro: React.FC = () => {
  return (
    <div
  className="relative w-full sm:w-48 bg-white text-black border-r border-gray-300 z-40 transition-all duration-300"
  style={{ minHeight: 'auto' }} // Ajuste automático de altura en móviles
>
  {/* Menú */}
  <div className="mt-4">
    <ul className="space-y-4">
      {/* Información General con fondo gris */}
      <li className="px-4 py-3 bg-gray-300 hover:bg-gray-200 transition-all duration-300 group">
        <a
          href="#"
          className="flex items-center font-normal text-black group-hover:text-gray-700 transition-all"
        >
          {/* Ícono Home */}
          <img
            src={menuIcon}
            alt="Menu Icon"
            className="w-8 h-8 cursor-pointer" 
          />
          {/* Nombre de la página - se oculta en móviles */}
          <span className="ml-4 text-sm hidden sm:block">Página Principal</span>
        </a>
      </li>
    </ul>
  </div>
</div>

  );
};

export default Nav_intro;
