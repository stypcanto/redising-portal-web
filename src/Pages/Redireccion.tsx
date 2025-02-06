import { useState } from "react";
import { Link } from "react-router-dom";
import Footer_azul from "../components/Footer/Footer_azul";
import Header_template from "../components/Header/Header_template";
import Nav_intro from "../components/Nav/Nav_intro";
import NavTransversal from "../components/Nav/Nav_transversal";
import CardsList from "../components/Card/CardList";
import { CardsDataAdminType } from "../types/CardsDataAdminType"; // Import the type

const Redireccion = () => {
  // Inicializamos con "DireccionGeneral"
  const [selectedCard, setSelectedCard] = useState<keyof CardsDataAdminType>("DireccionGeneral");

  function handleCardClick(cardName: keyof CardsDataAdminType) {
    if (selectedCard !== cardName) {
      setSelectedCard(cardName);
    }
  }

  // Opciones del menú
  const menuOptions: { key: keyof CardsDataAdminType; label: string }[] = [
    { key: "DireccionGeneral", label: "Dirección General" },
    { key: "SDGT", label: "SDGT" },
    { key: "SDRIST", label: "SDRIST" },
    { key: "DireccionDespacho", label: "Dirección de Despacho" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header_template>
        <div className="flex items-center justify-between p-4 space-x-4 sm:space-x-6 md:space-x-8">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gray-400">
            <img
              src="/images/medico1.jpg"
              alt="Foto de usuario"
              className="w-full h-full object-cover"
            />
          </div>
          <Link
            to="/"
            className="bg-white sm:w-auto w-20 h-12 sm:h-10 text-xs sm:text-sm text-[#2e63a6] px-5 py-2 rounded transition duration-300 ease-in-out transform hover:bg-blue-400 hover:text-white hover:scale-110 shadow-lg"
          >
            Cerrar Sesión
          </Link>
        </div>
      </Header_template>

      <div className="flex flex-grow flex-col lg:flex-row">
        <Nav_intro />

        <div className="flex-grow bg-blue-100 py-5 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="sm:text-xl font-bold m-2 text-[#2e63a6] mb-4 uppercase sm:text-left">
              Bienvenido al Portal de Datos del CENATE
            </h1>

            {/* Menú de opciones con estado activo */}
            <nav className="bg-white py-2 mb-4 shadow-lg rounded-xl">
              <div className="max-w-4xl mx-auto text-center">
                <ul className="flex justify-center sm:space-x-6 sm:flex-wrap p-2">
                  {menuOptions.map(({ key, label }) => (
                    <li key={key}>
                      <button
                        className={`text-sm py-2 px-4 rounded transition duration-300 ${
                          selectedCard === key ? "bg-[#2e63a6] text-white" : "hover:bg-[#2e63a6] hover:text-white"
                        }`}
                        onClick={() => handleCardClick(key)}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Muestra los cards según la selección */}
            <CardsList selectedCard={selectedCard} />
          </div>
        </div>

        <NavTransversal />
      </div>

      <Footer_azul />
    </div>
  );
};

export default Redireccion;
