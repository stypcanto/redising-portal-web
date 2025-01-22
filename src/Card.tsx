import React from "react";
import "./Card.css";

interface CardProps {
  title: string;
  imageSrc: string;
  subtitle?: string;
  onClick: string; // Ahora `onClick` es un string que contiene la URL
}

const Card: React.FC<CardProps> = ({ title, imageSrc, subtitle, onClick }) => {
  return (
    <div className="card" onClick={() => window.open(onClick, "_blank")}> {/* Abre el enlace en una nueva pestaña */}
      <img src={imageSrc} alt={title} className="card-image" />
      <h2>{title}</h2>
      {subtitle && <h3 className="card-subtitle">{subtitle}</h3>}
    </div>
  );
};

export default Card;

