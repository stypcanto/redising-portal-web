import { useState } from "react"; // Importa el hook useState de React para manejar el estado
import { info_navprincipal } from "../Data/info_navprincipal"; // Importa los datos de navegación principal
import { info_gestionterritorial } from "../Data/info_gestionterritorial"; // Importa los datos de telegestión
import { info_coord_area } from "../Data/info_coord_area"; // Importa los datos de coordinadores de área
import { info_gestoradecitas } from "../Data/info_gestoradecitas"; // Importa los datos de gestores de citas
import { info_telecapa_teleiec } from "../Data/info_telecapa_teleiec"; // Importa los datos de telecapacitación / TeleIEC
import { info_herra_TI } from "../Data/info_herra_TI"; // Importa los datos de herramientas TI
import { info_gestionTI } from "../Data/info_gestionTI"; // Importa los datos de gestión TI

import "../../Styles/modal.css"; // Importa los estilos CSS para los modales

type NavIndex = {
  title: string; // Título de la tarjeta o sección
  description: string; // Descripción de la tarjeta o sección
  icon: string; // Icono asociado a la tarjeta o sección
  url?: string; // URL opcional a la que se puede redirigir
};

type NavPrincipalAreas = {
  DireccionGeneral: NavIndex[]; // Array de tarjetas para Dirección General
  SDGT: NavIndex[]; // Array de tarjetas para SDGT
  SDRIST: NavIndex[]; // Array de tarjetas para SDRIST
  DireccionDespacho: NavIndex[]; // Array de tarjetas para Dirección de Despacho
};

const List_SDGT = ({ selectedCard }: { selectedCard: keyof NavPrincipalAreas | null }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null); // Estado para la sección activa
  const [selectedOptionCard, setSelectedOptionCard] = useState<string | null>(null); // Estado para la opción de tarjeta seleccionada
  const [showModal, setShowModal] = useState(false); // Estado para mostrar u ocultar el modal

  const handleShowModal = () => setShowModal(true); // Función para mostrar el modal
  const handleCloseModal = () => setShowModal(false); // Función para cerrar el modal

  const cardsadmin = selectedCard ? [...(info_navprincipal[selectedCard] || [])] : []; // Carga las tarjetas dependiendo de la sección seleccionada

  if (!cardsadmin.length) {
    return <div>No se encontraron tarjetas para la sección seleccionada.</div>; // Si no hay tarjetas para la sección, muestra un mensaje
  }

  const handleCardClick = (title: string, url?: string) => {
    const standardSubCards = [
      "Gestores Territoriales", 
      "Gestoras de Citas", 
      "Herramientas de progr. TI", 
      "Gestión TI", 
      "Telecapacitación / TeleIEC"
    ];
    
    // Si la tarjeta es una de las opciones estándar, activa la sección correspondiente
    if (title.trim() === "Coordinadores de área" || standardSubCards.includes(title)) {
      setActiveSection(title);
    } else if (!url?.trim()) {
      handleShowModal(); // Si no hay URL, muestra el modal
    } else {
      window.open(url, "_blank"); // Si hay URL, abre en una nueva pestaña
    }
  };

  const selectedInfoArray =
    activeSection === "Gestores Territoriales" ? info_gestionterritorial :
    activeSection === "Gestoras de Citas" ? info_gestoradecitas :
    activeSection === "Herramientas de progr. TI" ? info_herra_TI :
    activeSection === "Gestión TI" ? info_gestionTI :
    activeSection === "Telecapacitación / TeleIEC" ? info_telecapa_teleiec :
    []; // Determina qué información mostrar según la sección activa

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg min-h-[300px]">
      {activeSection ? (
        <div>
          <h3 className="text-xl font-semibold text-[#2e63a6] mb-6">{activeSection}</h3>

          {activeSection === "Coordinadores de área" && (
            <div>
              <nav className="grid grid-cols-1 sm:grid-cols-2 md:flex md:justify-between bg-blue-100 p-3 rounded-lg shadow-md mb-4 gap-2">
                {/* Muestra botones para diferentes opciones de coordinadores de área */}
                {["Coord. de Gestión de Citas", "Coord de TC / TO / TINT", "Coord. de TM / TU", "Coord e TAD", "Coord. General"].map((navOption) => (
                  <button 
                    key={navOption} 
                    onClick={() => setSelectedOptionCard(navOption)}
                    className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm text-center transition-transform duration-200 hover:scale-105 ${
                      selectedOptionCard === navOption ? "bg-[#2e63a6] text-white" : "bg-white text-[#2e63a6]"
                    }`}
                  >
                    {navOption}
                  </button>
                ))}
              </nav>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Muestra las opciones del coordinador de área seleccionado */}
                {selectedOptionCard && info_coord_area[selectedOptionCard] ? (
                  info_coord_area[selectedOptionCard].map((option) => (
                    <a
                      key={option.title}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-3 hover:bg-gray-200 transition-transform"
                    >
                      <img src={option.icon} alt={option.title} className="w-8 h-8" />
                      <h4 className="text-sm md:text-xs sm:text-base font-medium">{option.title}</h4>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500">Seleccione una opción</p>
                )}
              </div>
            </div>
          )}

          {activeSection === "Telecapacitación / TeleIEC" && (
            <div>
              <nav className="grid grid-cols-1 sm:grid-cols-2 md:flex md:justify-center bg-blue-100 p-3 rounded-lg shadow-md mb-4 gap-2">
                {/* Muestra botones para Telecapacitación y TeleIEC */}
                {["Telecapacitaciones", "TeleIEC"].map((navOption) => (
                    <button 
                      key={navOption} 
                      onClick={() => setSelectedOptionCard(navOption)}
                      className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm text-center transition-transform duration-200 hover:scale-105 ${
                      selectedOptionCard === navOption ? "bg-[#2e63a6] text-white" : "bg-white text-[#2e63a6]"
                     }`}
                         >
                     {navOption}
                   </button>
                    ))}
            </nav>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Muestra las opciones correspondientes a la opción seleccionada (Telecapacitación o TeleIEC) */}
                {selectedOptionCard && info_telecapa_teleiec[selectedOptionCard] ? (
                  info_telecapa_teleiec[selectedOptionCard].map((option) => (
                    <a
                      key={option.title}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-3 hover:bg-gray-200 transition-transform"
                    >
                      <img src={option.icon} alt={option.title} className="w-8 h-8" />
                      <h4 className="text-sm md:text-xs sm:text-base font-medium">{option.title}</h4>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500">Seleccione una opción</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Muestra las tarjetas según la información seleccionada */}
            {Array.isArray(selectedInfoArray) && selectedInfoArray.length > 0 ? (
              selectedInfoArray.map((option) => (
                <a
                  key={option.title}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-4 rounded-lg shadow-md flex text-left items-center gap-3 hover:bg-gray-200 transition-transform"
                >
                  <img src={option.icon} alt={option.title} className="w-8 h-8" />
                  <h4 className="text-sm md:text-xs sm:text-base font-medium">{option.title}</h4>
                </a>
              ))
            ) : (
              <p className="text-gray-500 mb-10"></p>
            )}
          </div>

          <button 
            onClick={() => setActiveSection(null)} 
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-110">
            Cerrar Sección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Muestra las tarjetas de la sección principal */}
          {cardsadmin.map((card) => (
            <div
              key={card.title}
              className="bg-blue-50 flex items-center gap-3 p-4 rounded-lg shadow-lg hover:bg-blue-100 transition cursor-pointer"
              onClick={() => handleCardClick(card.title, card.url)}
            >
               <img src={card.icon} alt={card.title} className="w-8 h-8" />
              <h3 className="text-sm font-semibold">{card.title}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Muestra el modal si está activo */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Aviso Importante</h2>
            <p className="modal-message">
              Este enlace no está disponible por el momento. Por favor, inténtelo más tarde.
            </p>
            <button className="modal-button" onClick={handleCloseModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List_SDGT;
