// /Pages/PortalMedico.tsx
import React, { useState } from "react";
import Card from "../components/Card/Card";
import Header from "../components/Header/Header";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer/Footer";
import { cardData } from "../components/Data/data";
import logoLeft from "/images/LOGO CENATE3.png";
import logoRight from "/images/LOGO CENATE2.png";

const PortalMedico: React.FC = () => {
    const [cards] = useState(cardData);
    const [isNavExpanded, setIsNavExpanded] = useState(false); // Control de estado de expansión de la barra
  
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#2b75b2] to-[#ffffff]">
        {/* Barra de navegación con expansión */}
        <Nav setIsNavExpanded={setIsNavExpanded} />
  
        {/* Contenedor de Header y main */}
        <div className="flex-1 w-full mx-auto py-0 transition-all duration-300">
          <div className={`transition-all duration-300 ${isNavExpanded ? "ml-64" : "ml-16"}`}>
            <Header title="Portal Médico" logoLeft={logoLeft} logoRight={logoRight} />
          </div>
  
          <main className={`w-auto mt-6 transition-all duration-300 px-10 ${isNavExpanded ? "ml-64" : "ml-16"}`}>
            {/* Título principal */}
            <h1 className="text-3xl font-bold text-center mb-6 text-white">PANEL PRINCIPAL TC TM TO</h1>
  
            {/* Grid para los cards */}
            <div className="mt-11 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 transition-all duration-300">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  title={card.title}
                  imageSrc={card.imageSrc}
                  subtitle={card.subtitle}
                  onClick={card.onClick}
                />
              ))}
            </div>
          </main>
        </div>
  
        {/* Footer */}
        <Footer />
      </div>
    );
};

export default PortalMedico;
