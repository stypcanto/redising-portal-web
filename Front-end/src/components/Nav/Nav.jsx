import React, { useState } from "react";
import menuIcon from "/images/Iconos_Imagenes - teleconsulta.svg";

const Nav = ({ isNavExpanded, setIsNavExpanded }) => {
  const [infoGeneralExpanded, setInfoGeneralExpanded] = useState(false);
  const [medLibraryExpanded, setMedLibraryExpanded] = useState(false);
  const [lawsNormsExpanded, setLawsNormsExpanded] = useState(false);

  return (
    <div
      className={`transition-all duration-300 fixed top-20  left-0 h-full ${isNavExpanded ? "w-72" : "w-16"} bg-[#0a5ba9] text-[#ecf0f1] shadow-lg z-50`}
      onMouseEnter={() => {
        setIsNavExpanded(true); // Expande el menú cuando se pasa el ratón por encima
      }}
      onMouseLeave={() => {
        setIsNavExpanded(false); // Contrae el menú cuando el ratón sale
      }}
    >
      {/* Logo o ícono */}
      <div className="flex justify-center mt-12">
        <img src={menuIcon} alt="Menu Icon" className="w-10 h-10 cursor-pointer" />
      </div>

      {/* Menú */}
      {isNavExpanded && (
        <div className="mt-12 text-white">
          <ul className="space-y-4">
            {/* Información General */}
            <li
              className="px-6 py-3 transition-all duration-300 rounded-md hover:bg-gray-800 group"
              onMouseEnter={() => setInfoGeneralExpanded(true)}
              onMouseLeave={() => setInfoGeneralExpanded(false)}
            >
              <a href="#" className="flex items-center font-semibold text-sm text-white group-hover:text-[#ecf0f1] transition-all">
                Información General
              </a>
              {infoGeneralExpanded && (
                <ul className="pl-8 mt-2 space-y-2">
                  <li><a href="#" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Panel Principal TC TM TO</a></li>
                  <li><a href="#" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Panel Principal TAD</a></li>
                  <li><a href="teledot.html" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all" target="_blank" rel="noopener noreferrer">Teledot</a></li>
                </ul>
              )}
            </li>

            {/* Biblioteca Médica */}
            <li
              className="px-6 py-3 transition-all duration-300 rounded-md hover:bg-gray-800 group"
              onMouseEnter={() => setMedLibraryExpanded(true)}
              onMouseLeave={() => setMedLibraryExpanded(false)}
            >
              <a href="#" className="flex items-center font-semibold text-sm text-white group-hover:text-[#ecf0f1] transition-all">
                Biblioteca Médica
              </a>
              {medLibraryExpanded && (
                <ul className="pl-8 mt-2 space-y-2 text-white">
                  <li><a href="#subsection1" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Recursos en Medicina</a></li>
                  <li><a href="#subsection2" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Promoción de una buena prescripción</a></li>
                  <li><a href="#subsection3" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Endocrinología</a></li>
                  <li><a href="#subsection4" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Reumatología</a></li>
                  <li><a href="#subsection5" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Urología</a></li>
                  <li><a href="#subsection6" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Cardiología</a></li>
                </ul>
              )}
            </li>

            {/* Leyes y Normas */}
            <li
              className="px-6 py-3 transition-all duration-300 rounded-md hover:bg-gray-800 group"
              onMouseEnter={() => setLawsNormsExpanded(true)}
              onMouseLeave={() => setLawsNormsExpanded(false)}
            >
              <a href="#" className="flex items-center font-semibold text-sm text-white group-hover:text-[#ecf0f1] transition-all">
                Leyes y Normas
              </a>
              {lawsNormsExpanded && (
                <ul className="pl-8 mt-2 space-y-2 text-white">
                  <li><a href="#subsection7" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Leyes</a></li>
                  <li><a href="#subsection8" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Normas MINSA</a></li>
                  <li><a href="#subsection9" className="text-sm text-[#ecf0f1] hover:text-[#3498db] transition-all">Normas EsSalud</a></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Nav;
