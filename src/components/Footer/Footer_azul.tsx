import React from "react";

const Footer_azul: React.FC = () => {
  return (
    <footer className=" bg-[#2e63a6] text-white py-6 ">
      <div className="container mx-auto text-center">
        {/* 
  <div className="flex justify-center space-x-6 mb-4">
    <a href="/" className="hover:text-blue-400  transition-colors duration-300">Inicio</a>
    <a href="/about" className="hover:text-blue-400 transition-colors duration-300">Acerca de</a>
    <a href="/contact" className="hover:text-blue-400 transition-colors duration-300">Contacto</a>
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

export default Footer_azul;
