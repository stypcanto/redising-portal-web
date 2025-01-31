import { useState } from "react";
import { cardsData_admin } from "../Data/data_card_admin";

type CardType = {
  title: string;
  description: string;
  icon: string;
  url?: string; // Asegúrate de incluir la propiedad url
};

type CardsDataAdminType = {
  DireccionGeneral: CardType[];
  SDGT: CardType[];
  SDRIST: CardType[];
  DireccionDespacho: CardType[];
};

const CardsList = ({ selectedCard }: { selectedCard: keyof CardsDataAdminType | null }) => {
  // Estado para controlar el popup
  const [isPopupVisible, setPopupVisible] = useState(false);

    // Verifica que selectedCard no sea null antes de acceder a cardsData_admin
  const cardsadmin = selectedCard ? cardsData_admin[selectedCard] : [];

  const handleCardClick = (url?: string) => {
    if (!url) {
      // Si no hay URL, mostramos el popup
      setPopupVisible(true);
    } else {
      // Si hay URL, redirige al hipervínculo
      window.open(url, "_blank");
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };


  return (
    <div className="bg-white p-8 rounded-xl shadow-lg min-h-[300px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardsadmin.map((card, index) => (
          <div
            key={index}
            className="bg-blue-50 p-2 rounded-lg shadow-lg hover:bg-blue-100 transition cursor-pointer"
            onClick={() => handleCardClick(card.url)}
          >
            <div className="flex items-center">
              <img
                src={card.icon}
                alt="Ícono"
                className="w-8 h-8 mr-4"
              />
              <div className="flex items-start flex-col">
                <h3 className="text-sm font-semibold">{card.title}</h3>
                <p className="text-[#2e63a6] text-xs">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup de "Información no disponible" */}
      {isPopupVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <h3 className="text-xl font-semibold text-center">Información no disponible</h3>
            <p className="text-center text-sm mt-2">Esta tarjeta no tiene un enlace disponible.</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closePopup}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsList;