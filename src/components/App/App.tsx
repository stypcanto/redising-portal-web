import React, { useState } from "react";
import Card from "../Card/Card";
import Header from "../Header/Header"; // Importar el Header
import Nav from "../Nav/Nav"; // Importar el componente Nav
import "./App.css";
import { cardData } from "../Data/data";

// Importar las imágenes de los logos
import logoLeft from '../../../public/images/LOGO CENATE2.png'; 
import logoRight from '../../../public/images/LOGO CENATE3.png';

const App: React.FC = () => {
  const [cards] = useState(cardData);

  return (
    <div className="app">
      <div className="app-layout">
        {/* Aquí agregas el Nav a la izquierda */}
        <Nav /> 

        {/* El contenido principal */}
        <div className="main-content">
          <Header
            title="Bienvenido a CENATE"
            logoLeft={logoLeft}  // Pasar el logo izquierdo
            logoRight={logoRight} // Pasar el logo derecho
          />
          <main>
            <div className="card-container">
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
      </div>
    </div>
  );
};

export default App;
