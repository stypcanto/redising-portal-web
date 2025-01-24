import React from "react";
import "../styles.css";

type HeaderProps = {
  title: string;
  subtitle?: string;
  logoLeft?: string;  // Ruta del logo izquierdo
  logoRight?: string; // Ruta del logo derecho
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, logoLeft, logoRight }) => {
  return (
    <header className="bg-white flex items-center justify-between p-8">
      {/* Logo izquierdo con transición */}
      {logoLeft && (
        <img
          src={logoLeft}
          alt="Logo Izquierda"
          className="transition-all duration-300 ease-in-out w-48 h-auto object-contain sm:w-32 md:w-48"
        />
      )}

      {/* Contenedor central con el título y subtítulo */}
      <div className="text-center flex-1">
        <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
        {subtitle && <h2 className="text-xl text-gray-600 mt-2">{subtitle}</h2>}
      </div>

      {/* Logo derecho */}
      {logoRight && (
        <img
          src={logoRight}
          alt="Logo Derecha"
          className="w-52 h-auto object-contain sm:w-32 md:w-48"
        />
      )}
    </header>
  );
};

export default Header;
