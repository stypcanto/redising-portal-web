import React from "react";
import { info_gestionterritorial } from "../components/Data/info_gestionterritorial";

const GestionTerritorial = () => {
  return (
    <div className="flex flex-col items-center w-full bg-gradient-to-b from-[#2b75b2] to-[#ffffff] py-32 px-52">
      {/* Título */}
      <h1 className="mb-10 text-4xl font-extrabold text-center text-white drop-shadow-lg">
        Gestión Territorial
      </h1>

      {/* Grid de tarjetas */}
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {info_gestionterritorial.map((item, index) => (
          <a
            key={index}
            href={item.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-between p-6 transition-transform duration-300 ease-in-out bg-white shadow-lg h-34 w-72 rounded-xl hover:scale-105 hover:bg-[#2b75b2] hover:shadow-2xl hover:ring-4 hover:ring-blue-400/10"
          >
            {/* Ícono */}
            <div className="flex items-center justify-center w-16 h-16 transition-all duration-300 ease-in-out bg-blue-100 rounded-full hover:bg-white hover:shadow-md">
              <img
                src={item.icon}
                alt={item.title || "Ícono"}
                className="w-10 h-10"
                onError={(e) => (e.target.src = "/images/default-icon.svg")}
              />
            </div>

            {/* Título */}
            <h2 className="mt-1 font-semibold text-center text-gray-900 transition-colors duration-300 ease-in-out hover:text-white">
              {item.title}
            </h2>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GestionTerritorial;
