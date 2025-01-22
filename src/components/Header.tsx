import React, { useState } from "react";
import "./Header.css"; // Asegúrate de que el archivo CSS esté bien vinculado

const Header: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdown1Visible, setDropdown1Visible] = useState(false);
  const [dropdown2Visible, setDropdown2Visible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLinkClick = (link: string) => {
    // Handle link click logic here
  };

  const toggleDropdown1 = () => {
    setDropdown1Visible(!dropdown1Visible);
  };

  const toggleDropdown2 = () => {
    setDropdown2Visible(!dropdown2Visible);
  };

  return (
    <>
      {/* HEADER */}
      <header style={{ backgroundColor: "#f8f8f8", padding: "10px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img
            src="./images/Web Development Logo.png" // Ruta actualizada
            alt="Logo"
            style={{ width: "150px", height: "auto" }}
          />
          <div style={{ cursor: "pointer" }} onClick={toggleMenu}>
            <i className={`bx ${menuVisible ? "bx-x" : "bx-menu"}`} id="header-toggle"></i>
          </div>
        </div>
      </header>

      {/* NAV */}
      <div style={{ display: menuVisible ? "block" : "none" }} className="nav" id="navbar">
        <nav className="nav__container">
          {/* El contenido de tu menú */}
        </nav>
      </div>
    </>
  );
};

export default Header;
