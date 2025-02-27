import { useState } from "react"; 
import { info_navprincipal } from "../Data/info_navprincipal"; 
import { info_gestionterritorial } from "../Data/info_gestionterritorial"; 
import { info_coord_area } from "../Data/info_coord_area"; 
import { info_gestoradecitas } from "../Data/info_gestoradecitas"; 
import { info_telecapa_teleiec } from "../Data/info_telecapa_teleiec"; 
import { info_herra_TI } from "../Data/info_herra_TI"; 
import { info_gestionTI } from "../Data/info_gestionTI"; 

import "../../Styles/modal.css"; 

const List_SDGT = ({ selectedCard }) => {
  const [activeSection, setActiveSection] = useState(null); 
  const [selectedOptionCard, setSelectedOptionCard] = useState(null); 
  const [showModal, setShowModal] = useState(false); 

  const handleShowModal = () => setShowModal(true); 
  const handleCloseModal = () => setShowModal(false); 

  const cardsadmin = selectedCard && info_navprincipal[selectedCard] ? [...info_navprincipal[selectedCard]] : []; 

  if (!cardsadmin.length) {
    return <div>No se encontraron tarjetas para la sección seleccionada.</div>; 
  }

  const handleCardClick = (title, url) => {
    const standardSubCards = [
      "Gestores Territoriales", 
      "Gestoras de Citas", 
      "Herramientas de progr. TI", 
      "Gestión TI", 
      "Telecapacitación / TeleIEC"
    ];
    
    if (title.trim() === "Coordinadores de área" || standardSubCards.includes(title)) {
      setActiveSection(title);
    } else if (!url?.trim()) {
      handleShowModal();
    } else {
      window.open(url, "_blank");
    }
  };

  const selectedInfoArray =
    activeSection === "Gestores Territoriales" ? info_gestionterritorial :
    activeSection === "Gestoras de Citas" ? info_gestoradecitas :
    activeSection === "Herramientas de progr. TI" ? info_herra_TI :
    activeSection === "Gestión TI" ? info_gestionTI :
    activeSection === "Telecapacitación / TeleIEC" ? info_telecapa_teleiec :
    [];

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg min-h-[300px]">
      {activeSection ? (
        <div>
          <h3 className="text-xl font-semibold text-[#2e63a6] mb-6">{activeSection}</h3>

          {activeSection === "Coordinadores de área" && (
            <div>
              <nav className="grid grid-cols-1 gap-2 p-3 mb-4 bg-blue-100 rounded-lg shadow-md sm:grid-cols-2 md:flex md:justify-between">
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {selectedOptionCard && info_coord_area[selectedOptionCard] ? (
                  info_coord_area[selectedOptionCard].map((option) => (
                    <a
                      key={option.title}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 transition-transform bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
                    >
                      <img src={option.icon} alt={option.title} className="w-8 h-8" />
                      <h4 className="text-sm font-medium md:text-xs sm:text-base">{option.title}</h4>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500">Seleccione una opción</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.isArray(selectedInfoArray) && selectedInfoArray.length > 0 ? (
              selectedInfoArray.map((option) => (
                <a
                  key={option.title}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 text-left transition-transform bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
                >
                  <img src={option.icon} alt={option.title} className="w-8 h-8" />
                  <h4 className="text-sm font-medium md:text-xs sm:text-base">{option.title}</h4>
                </a>
              ))
            ) : (
              <p className="mb-10 text-gray-500"></p>
            )}
          </div>

          <button 
            onClick={() => setActiveSection(null)} 
            className="px-4 py-2 mt-4 text-white transition-transform duration-200 bg-green-600 rounded-lg hover:bg-green-700 hover:scale-110">
            Cerrar Sección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cardsadmin.map((card) => (
            <div
              key={card.title}
              className="flex items-center gap-3 p-4 transition rounded-lg shadow-lg cursor-pointer bg-blue-50 hover:bg-blue-100"
              onClick={() => handleCardClick(card.title, card.url)}
            >
              <img src={card.icon} alt={card.title} className="w-8 h-8" />
              <h3 className="text-sm font-semibold">{card.title}</h3>
            </div>
          ))}
        </div>
      )}

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
