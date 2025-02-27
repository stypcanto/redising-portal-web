import React from "react";

const Footer = () => {
  return (
    <footer className="text-[#2b75b2] py-6 mt-8">
      <div className="container mx-auto text-center">
        {/* 
        <div className="flex justify-center mb-4 space-x-6">
          <a href="/" className="transition-colors duration-300 hover:text-blue-400">Inicio</a>
          <a href="/about" className="transition-colors duration-300 hover:text-blue-400">Acerca de</a>
          <a href="/contact" className="transition-colors duration-300 hover:text-blue-400">Contacto</a>
        </div>
        */}
        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()} CENATE. Todos los derechos reservados.</p>
        </div>
        <div className="mt-4 text-sm">
          <p>Diseñado y desarrollado por <span className="font-semibold">Equipo de Gestión TI</span>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
