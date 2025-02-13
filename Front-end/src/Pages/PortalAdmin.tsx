import { useState } from "react";
import Footer_azul from "../components/Footer/Footer_azul";
import NavTransversal from "../components/Nav/Nav_transversal";
import List_SDGT from "../components/Card/List_SDGT";
import NavMenu from "../components/Nav/Nav_menu"; // ✅ Importar el nuevo menú
import { CardsDataAdminType } from "../types/CardsDataAdminType";

const PortalAdmin = () => {
  const [selectedSection, setSelectedSection] = useState<keyof CardsDataAdminType | "">("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Integrando NavMenu */}
      <NavMenu />

      {/* ✅ Barra lateral transversal */}
      <div className="flex flex-row flex-1">
      <NavTransversal />

        {/* ✅ Contenido dinámico */}
        <div className="flex-1 p-6">
          {selectedSection ? <List_SDGT selectedCard={selectedSection} /> : <p>Seleccione una sección</p>}
          <button onClick={() => setSelectedSection("validKey" as keyof CardsDataAdminType)}>Select Section</button>
        </div>
      </div>

      {/* ✅ Footer */}
      <Footer_azul />
    </div>
  );
};

export default PortalAdmin;
