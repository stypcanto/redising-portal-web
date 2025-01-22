import React from 'react';
import "../Header/Header.css";

type HeaderProps = {
  title: string;
  subtitle?: string;
  logoLeft?: string;  // Ruta del logo izquierdo
  logoRight?: string; // Ruta del logo derecho
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, logoLeft, logoRight }) => {
  return (
    <header className="header">
      {logoLeft && <img src={logoLeft} alt="Logo Izquierda" className="logo-left" />}
      <div className="header-content">
        <h1 className="title">{title}</h1>
        {subtitle && <h2 className="subtitle">{subtitle}</h2>}
      </div>
      {logoRight && <img src={logoRight} alt="Logo Derecha" className="logo-right" />}
    </header>
  );
};

export default Header;
