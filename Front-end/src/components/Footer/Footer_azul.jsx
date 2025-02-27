import React from "react";

const Footer_azul = () => {
  return (
    <footer className="bg-[#0a5ba9] text-white py-2">
      <div className="container mx-auto text-center">
        {/* 
        <div className="flex justify-center space-x-6 mb-4">
          <a href="/" className="hover:text-blue-400 transition-colors duration-300">Inicio</a>
          <a href="/about" className="hover:text-blue-400 transition-colors duration-300">Acerca de</a>
          <a href="/contact" className="hover:text-blue-400 transition-colors duration-300">Contacto</a>
        </div>
        */}
        <div className="text-center text-white text-xs py-0 border-gray-300">
          <p className="mb-1">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold">CENATE - ESSALUD</span>. Todos los derechos reservados.
          </p>
          <p className="mb-1">
            Diseñado y desarrollado por{" "}
            <span className="font-semibold text-white">Equipo de Gestión TI</span>.
          </p>
          <p className="text-white">Versión 1.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer_azul;
