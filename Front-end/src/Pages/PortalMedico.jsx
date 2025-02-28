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
  const [isNavExpanded, setIsNavExpanded] = useState(false); // Control de estado de la barra lateral

  return (
    <div className="flex flex-row w-full bg-gradient-to-b from-[#2b75b2] to-[#ffffff]">
      {/* Barra de navegación lateral */}
      <Nav isNavExpanded={isNavExpanded} setIsNavExpanded={setIsNavExpanded} />

      {/* Contenedor principal */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 px-9 py-9 ${isNavExpanded ? 'ml-70' : 'ml-20'}`}
      >
        {/* Título */}
        <h1 className="mt-16 text-3xl font-bold text-center text-white mb-14">
          PANEL PRINCIPAL TC TM TO
        </h1>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </div>
  );
};

export default PortalMedico;
