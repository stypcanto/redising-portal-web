import React, { useState } from "react";
import Card from "../Card/Card";
import Header from "../Header/Header"; // Importar el Header
import Nav from "../Nav/Nav"; // Importar el componente Nav
import Footer from "../Footer/Footer"; // Importar el Footer
import "./App.css";
import { cardData } from "../Data/data";

// Importar las imágenes de los logos
import logoLeft from "../../../public/images/LOGO CENATE3.png"; 
import logoRight from "../../../public/images/LOGO CENATE2.png";

const App: React.FC = () => {
  const [cards] = useState(cardData);
  const [isNavExpanded, setIsNavExpanded] = useState(false); // Control de estado de expansión de la barra

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#2b75b2] to-[#ffffff]">
      {/* Barra de navegación con expansión */}
      <Nav setIsNavExpanded={setIsNavExpanded} /> 

      {/* Contenedor para el Header y el main que se moverán */}
      <div className="flex-1 w-full mx-auto py-0 transition-all duration-300">
        
        
        {/* Header que también se moverá junto con el main */}
        <div className={`transition-all duration-300 ${isNavExpanded ? "ml-64" : "ml-16"}`}>
          <Header
            title=""
            logoLeft={logoLeft}  // Pasar el logo izquierdo
            logoRight={logoRight} // Pasar el logo derecho
          />
        </div>

        <main
          className={`w-auto mt-6 transition-all duration-300 px-10 ${
            isNavExpanded ? "ml-64" : "ml-16"
          }`} // Este margen se ajusta para mover el contenido (header + main) hacia la izquierda
        >

      {/* Título principal */}
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
      PANEL PRINCIPAL TC TM TO
      </h1>

          {/* Grid para los cards */}
          <div className="mt-11 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 transition-all duration-300">
            {cards.map((card) => (


              
              <Card
                key={card.id}
                title={card.title}
                imageSrc={card.imageSrc} // Pasando la imagen
                subtitle={card.subtitle} // Pasando el subtítulo
                onClick={card.onClick} // Pasando el onClick con la URL
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

export default App;
