import React, { useState } from "react";

const Nav: React.FC<{ setIsNavExpanded: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsNavExpanded }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`transition-all duration-300 fixed top-0 left-0 h-full ${expanded ? "w-64" : "w-16"} bg-blue-700 text-white`}
      onMouseEnter={() => {
        setExpanded(true);
        setIsNavExpanded(true); // Cambiar el estado de la expansión
      }}
      onMouseLeave={() => {
        setExpanded(false);
        setIsNavExpanded(false); // Cambiar el estado de la expansión
      }}
    >
      {/* Logo (opcional) */}
      <div className="flex justify-center mt-4">
        {/* Aquí puedes agregar un logo si deseas */}
        <img src="path-to-your-logo.png" alt="Logo" className="w-8 h-8" />
      </div>

      {/* Menú */}
      <ul className="mt-8 space-y-4">
        <li className="px-4 py-2">
          <a href="#" className="flex items-center">
            <span className={`transition-all duration-300 ${expanded ? "ml-2" : ""}`}>
              Información General
            </span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a href="#" className="flex items-center">
            <span className={`transition-all duration-300 ${expanded ? "ml-2" : ""}`}>
              Panel Principal TC TM TO
            </span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a href="#" className="flex items-center">
            <span className={`transition-all duration-300 ${expanded ? "ml-2" : ""}`}>
              Panel Principal TAD
            </span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a href="#" className="flex items-center">
            <span className={`transition-all duration-300 ${expanded ? "ml-2" : ""}`}>
              Teledot
            </span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a href="#" className="flex items-center">
            <span className={`transition-all duration-300 ${expanded ? "ml-2" : ""}`}>
              Biblioteca Médica
            </span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a href="#" className="flex items-center">
            <span className={`transition-all duration-300 ${expanded ? "ml-2" : ""}`}>
              Leyes y Normas
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
