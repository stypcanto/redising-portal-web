import React, { useState } from "react";
import Card from "./Card";
import Header from "./components/Header"; // Importar el Header
import "./App.css";
import { cardData } from "./data";

const App: React.FC = () => {
  const [cards, setCards] = useState(cardData);

  return (
    <div className="app">
      <Header /> {/* Usar el Header importado */}
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
  );
};

export default App;
