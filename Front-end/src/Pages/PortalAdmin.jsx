import { useState } from "react";
import Footer_azul from "../components/Footer/Footer_azul";
import NavTransversal from "../components/Nav/Nav_transversal";
import NavMenu from "../components/Nav/Nav_menu";
import PortalMedico from "./PortalMedico";
import GestionTerritorial from "./Gestionterritorial";

const PortalAdmin = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* ✅ Barra de navegación superior */}
      <NavMenu 
        onSelectSection={(section) => {
          if (section === "PortalMedico") {
            setSelectedSection(<PortalMedico />);
          } else if (section === "GestionTerritorial") {
            setSelectedSection(<GestionTerritorial />);
          } else {
            setSelectedSection(null); // Volver a la pantalla de bienvenida si la opción no es válida
          }
        }} 
      />

      <div className="flex flex-col flex-1 h-full lg:flex-row">
        {/* ✅ Contenido principal dinámico con prioridad */}
        <div className="relative flex items-center justify-center flex-1">
          {!selectedSection ? (
            <>
              {/* Imagen de fondo completamente extendida */}
              <div
                className="absolute inset-0 w-full h-full bg-center bg-cover"
                style={{ backgroundImage: "url('/images/CENATEANGULAR.png')" }}
              ></div>

              {/* ✅ Capa de oscurecimiento para mejorar la legibilidad */}
              <div className="absolute inset-0 bg-blue-100/80"></div>

              {/* Contenido centrado y adaptado para móviles */}
              <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                <h1 className="mt-20 md:mt-14 lg:mt-0 text-2xl md:text-4xl font-bold text-[#1d4f8a] drop-shadow-lg max-w-[95%] md:max-w-[70%]">
                  ¡Bienvenido al Portal de CENATE!
                </h1>
                <p className="mt-2 text-sm md:text-lg text-black drop-shadow max-w-[85%] md:max-w-[70%]">
                  Accede a la información y herramientas que necesitas. Por favor, 
                  selecciona una opción del menú para comenzar.
                </p>
              </div>
            </>
          ) : (
            selectedSection
          )}
        </div>

        {/* ✅ NavTransversal aparece en la derecha en web y abajo en tablet/móvil */}
        <div className="flex-col flex-shrink-0 hidden shadow-lg lg:flex w-72">
          <NavTransversal />
        </div>
      </div>

      {/* ✅ NavTransversal para móviles/tablets → Se mueve abajo */}
      <div className="w-full lg:hidden">
        <NavTransversal />
      </div>

      {/* ✅ Footer */}
      <Footer_azul />
    </div>
  );
};

export default PortalAdmin;
