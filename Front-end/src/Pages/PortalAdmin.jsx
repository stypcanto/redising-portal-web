import { useState } from "react";
import Footer_azul from "../components/Footer/Footer_azul";
import NavTransversal from "../components/Nav/Nav_transversal";
import List_SDGT from "../components/Card/List_SDGT";
import NavMenu from "../components/Nav/Nav_menu"; // ✅ Importar el nuevo menú
import { cardsDataAdmin } from "../types/CardsDataAdmin"; // Sin extensión .js

console.log(cardsDataAdmin); // Para verificar si funciona


const PortalAdmin = () => {
  const [selectedSection, setSelectedSection] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Barra de navegación superior */}
      <NavMenu />

      <div className="flex flex-row flex-1">
        {/* ✅ Barra lateral transversal */}
        <NavTransversal />

        {/* ✅ Contenido dinámico */}
        <div className="flex-1 p-6">
          {selectedSection ? (
            <List_SDGT selectedCard={selectedSection} />
          ) : (
            <p>Seleccione una sección</p>
          )}

          {/* ✅ Botón de prueba para cambiar la sección */}
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => setSelectedSection("validKey")}
          >
            Seleccionar Sección
          </button>
        </div>
      </div>

      {/* ✅ Footer */}
      <Footer_azul />
    </div>
  );
};

export default PortalAdmin;
