import { useState } from "react";
import { cardsData_admin } from "../Data/data_card_admin";
import { extraOptions } from "../Data/data_minicard"; 
import { telemedicinaOptionsData } from "../Data/telemedicinaOptionData";
import "../../Styles/modal.css"

// Definición de los tipos de datos para las tarjetas
// Esto ayuda a mantener el código más estructurado y con tipado fuerte
type CardType = {
  title: string;
  description: string;
  icon: string;
  url?: string;
};

type CardsDataAdminType = {
  DireccionGeneral: CardType[];
  SDGT: CardType[];
  SDRIST: CardType[];
  DireccionDespacho: CardType[];
};

const CardsList = ({ selectedCard }: { selectedCard: keyof CardsDataAdminType | null }) => {
  // Estado para manejar qué sección está activa y se mostrará en la página
  const [activeSection, setActiveSection] = useState<string | null>(null);
  // Estado para manejar la opción seleccionada dentro de Telemedicina
  const [selectedTelemedicinaOption, setSelectedTelemedicinaOption] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // Estado para el modal


  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Obtiene las tarjetas correspondientes a la sección seleccionada
  const cardsadmin = selectedCard ? [...(cardsData_admin[selectedCard] || [])] : [];

  if (!cardsadmin.length) {
    return <div>No se encontraron tarjetas para la sección seleccionada.</div>;
  }

  // Maneja el clic en una tarjeta
  const handleCardClick = (title: string, url?: string) => {
    const standardSubCards = ["Telegestión"];

    if (title.trim() === "Telemedicina.") {
      setActiveSection(title); // Activa la sección de Telemedicina
    } else if (standardSubCards.includes(title)) {
      setActiveSection(title); // Activa la sección correspondiente a Telegestión
    } else if (!url?.trim()) {
      handleShowModal();  // Muestra un mensaje si no hay URL
    } else {
      window.open(url, "_blank"); // Abre el enlace en una nueva pestaña
    }
  };

  return (
    
    <div className="bg-white p-4 rounded-xl shadow-lg min-h-[300px]">
      {activeSection ? (
        // Sección activa: muestra el contenido correspondiente en la página
        <div>
          <h3 className="text-xl font-semibold text-[#2e63a6] mb-6">{activeSection}</h3>
          
          {/* Si la sección es Telemedicina, muestra sus opciones */}
          {activeSection === "Telemedicina." ? (
            <div>
              <nav className="flex justify-between bg-blue-100 p-3 rounded-lg shadow-md mb-4 gap-2">
                {[
                  "Coord. de Gestión de Citas", 
                  "Coord de TC / TO / TINT", 
                  "Coord. de TM / TU", 
                  "Coord e TAD", 
                  "Coord. General"
                ].map((navOption) => (
                  <button 
                    key={navOption} 
                    onClick={() => setSelectedTelemedicinaOption(navOption)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      selectedTelemedicinaOption === navOption ? "bg-[#2e63a6] text-white" : "bg-white text-[#2e63a6]"
                    }`}
                  >
                    {navOption}
                  </button>
                ))}
              </nav>

              {/* Renderiza opciones según la selección en el NAV */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedTelemedicinaOption && telemedicinaOptionsData[selectedTelemedicinaOption] ? (
                  telemedicinaOptionsData[selectedTelemedicinaOption].map((option) => (
                    <a
                      key={option.title}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-3 hover:bg-gray-200 transition-transform"
                    >
                      <img src={option.icon} alt={option.title} className="w-10 h-10" />
                      <h4 className="font-medium">{option.title}</h4>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500">Seleccione una opción</p>
                )}
              </div>
            </div>
          ) : (
            // Si es otra sección, muestra las opciones generales
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {extraOptions.map((option) => (
                <a
                  key={option.title}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-3 hover:bg-gray-200 transition-transform"
                >
                  <img src={option.icon} alt={option.title} className="w-10 h-10" />
                  <h4 className="text-sm md:text-xs sm:text-base font-medium">{option.title}</h4>
                </a>
              ))}
            </div>
          )}

          {/* Botón para regresar a la vista inicial */}
         

          <button 
          onClick={() => setActiveSection(null)} 
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-110">
           Cerrar Sección
          </button>

        </div>
      ) : (
        // Vista inicial: muestra las tarjetas principales
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsadmin.map((card) => (
            <div
              key={card.title}
              className="bg-blue-50 p-4 rounded-lg shadow-lg hover:bg-blue-100 transition cursor-pointer"
              onClick={() => handleCardClick(card.title, card.url)}
            >
              <div className="flex items-center">
                <img src={card.icon || "/images/icono-defecto.png"} alt={card.title} className="w-6 h-6 mr-4" />
                <div className="items-start flex flex-col">
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                  <p className="text-[#2e63a6] text-xs">{card.description}</p>
                </div>
              </div>
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

export default CardsList;
