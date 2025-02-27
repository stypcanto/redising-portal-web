// /Pages/PortalMedico.tsx
import React, { useState } from "react";
import Card from "../components/Card/Card";
import Header from "../components/Header/Header";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer/Footer";
import { cardData } from "../components/Data/data";
import logoLeft from "/images/LOGO CENATE3.png";
import logoRight from "/images/LOGO CENATE2.png";

const PortalMedico = () => { 
    const [cards] = useState(cardData);
    const [isNavExpanded, setIsNavExpanded] = useState(false); // Control de estado de expansión de la barra
  
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#2b75b2] to-[#ffffff]">
        {/* Barra de navegación con expansión */}
        <Nav setIsNavExpanded={setIsNavExpanded} />
  
        {/* Contenedor de Header y main */}
        <div className="flex-1 w-full py-0 mx-auto transition-all duration-300">
          <div className={`transition-all duration-300 ${isNavExpanded ? "ml-64" : "ml-16"}`}>
            <Header title="Portal Médico" logoLeft={logoLeft} logoRight={logoRight} />
          </div>
  
          <main className={`w-auto mt-6 transition-all duration-300 px-10 ${isNavExpanded ? "ml-64" : "ml-16"}`}>
            {/* Título principal */}
            <h1 className="mb-6 text-3xl font-bold text-center text-white">PANEL PRINCIPAL TC TM TO</h1>
  
            {/* Grid para los cards */}
            <div className="grid grid-cols-1 gap-8 transition-all duration-300 mt-11 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
