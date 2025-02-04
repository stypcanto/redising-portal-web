import { useState } from "react";
import { cardsData_admin } from "../Data/data_card_admin";
import { extraOptions } from "../Data/data_minicard"; // ✅ Usa la importación en lugar de redefinirlo

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
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedSubCard, setSelectedSubCard] = useState<string | null>(null);

  const cardsadmin = selectedCard ? [...(cardsData_admin[selectedCard] || [])] : [];

  if (!cardsadmin.length) {
    return <div>No se encontraron tarjetas para la sección seleccionada.</div>;
  }

  const handleCardClick = (title: string, url?: string) => {
    setSelectedSubCard(null); // Reiniciar el estado antes de cambiar de sección

    if (title === "Telegestión") {
      setSelectedSubCard(title);
    } else if (!url?.trim()) {
      setPopupVisible(true);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div key={selectedCard} className="bg-white p-8 rounded-xl shadow-lg min-h-[300px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardsadmin.map((card) => (
          <div
            key={card.title}
            className="bg-blue-50 p-2 rounded-lg shadow-lg hover:bg-blue-100 transition cursor-pointer"
            onClick={() => handleCardClick(card.title, card.url)}
          >
            <div className="flex items-center">
              <img src={card.icon || "/images/icono-defecto.png"} alt={card.title} className="w-8 h-8 mr-4" />
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold">{card.title}</h3>
                <p className="text-[#2e63a6] text-xs">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

{/* Card emergente con nuevas opciones */}
{selectedSubCard && (
  <div className="fixed inset-0 bg-[#2e63a6]/50 flex justify-center items-center z-50">

    <div className="w-[80%] max-w-2xl bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center relative">
      <h3 className="text-xl text-[#2e63a6] font-semibold mb-6">{selectedSubCard}</h3>

      {/* Opciones dentro del Card emergente */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
        {extraOptions.map((option) => (
          <a
            key={option.title}
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 p-4 rounded-lg shadow-md w-full flex items-center gap-3 hover:bg-gray-200 hover:scale-105 transition-transform"
          >
            <img src={option.icon} alt={option.title} className="w-10 h-10" />
            <div>
              <h4 className="font-medium">{option.title}</h4>
            
            </div>
          </a>
        ))}
      </div>

      {/* Botón de cierre */}
      <button 
        onClick={() => setSelectedSubCard(null)} 
        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full text-lg"
      >
        ✕
      </button>
    </div>
  </div>
)}



      {/* Popup de "Información no disponible" */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
            <h3 className="text-xl font-semibold">Archivo no disponible</h3>
            <p className="text-sm mt-2">El enlace asociado a esta tarjeta no está disponible en este momento.</p>
            <button onClick={() => setPopupVisible(false)} className="mt-4 bg-[#2e63a6] text-white px-4 py-2 rounded-lg">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsList;
