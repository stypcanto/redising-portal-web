import React, { useState } from "react";
import { Link } from "react-router-dom";

// Definir tipos de los elementos del menú
interface MenuItemProps {
  id: string;
  label: string;
  path: string;
  subMenu?: Array<{ label: string; path: string }>;
}

// Lista de menús con sus rutas y subopciones
const menuItems: MenuItemProps[] = [
  { id: "menu1", label: "Inicio", path: "/navmenu" },
  {
    id: "menu2",
    label: "Información Asistencial",
    path: "#",
    subMenu: [
      { label: "Portal Médico", path: "/PortalMedico" },
      { label: "Listado Personal", path: "/listadopersonal" },
    ],
  },
  {
    id: "menu3",
    label: "Información Administrativa",
    path: "#",
    subMenu: [
      { label: "Dirección General", path: "/direccion-general" },
      { label: "SDGT", path: "/sdgt" },
      { label: "SDRIST", path: "/sdrist" },
      { label: "Dirección de Despacho", path: "/direccion-despacho" },
    ],
  },
  {
    id: "menu4",
    label: "Cuenta",
    path: "#",
    subMenu: [
      { label: "Editar perfil", path: "/editar-perfil" },
      { label: "Ver accesos permitidos", path: "/accesos" },
      { label: "Cerrar sesión", path: "/cerrar-sesion" },
    ],
  },
];

const NavMenu = () => {
  return (
    <nav className='bg-[#0a5ba9] text-white py-6 px-18 fixed top-0 w-full z-50 shadow-lg'>
      {/* 🔵 Logo */}
      <div className='mb-2 flex justify-center sm:justify-end'>
        <img
          src='/images/LOGOESSALUD.png'
          alt='Centro Nacional de Telemedicina'
          className='sm:w-40 w-24 h-auto'
        />
      </div>

      {/* 📌 Menús */}
      <div className='sm:flex space-x-4 items-start sm:space-x-4 sm:flex-row flex-col sm:space-y-0 space-y-2'>
        {menuItems.map((menu) => (
          <HoverMenu
            key={menu.id}
            label={menu.label}
            path={menu.path}
            subMenu={menu.subMenu}
          />
        ))}
      </div>
    </nav>
  );
};

// Definir los tipos de props para HoverMenu
interface HoverMenuProps {
  label: string;
  path: string;
  subMenu?: Array<{ label: string; path: string }>;
}

const HoverMenu: React.FC<HoverMenuProps> = ({ label, path, subMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Manejo del hover y el clic
  const handleMouseEnter = () => {
    if (!isClicked) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isClicked) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    setIsClicked((prev) => !prev); // Cambiar el estado de clic
  };

  // Cerrar el submenú al salir del área completa
  const handleCloseOnExit = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      if (!e.target.closest(".submenu")) {
        setIsOpen(false);
        setIsClicked(false);
      }
    }
  };

  return (

<div
  className="relative"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={handleClick}
  onMouseDown={handleCloseOnExit}
>
  {/* Enlace principal */}
  <Link
    to={path}
    className="px-4 py-6 rounded-lg text-white transition duration-300 ease-in-out w-full text-center sm:text-left"
  >
    {label}
  </Link>

  {/* Submenú (si existe) */}
  {subMenu && isOpen && (
    <div
      className="submenu absolute left-0 bg-white border border-gray-200 shadow-lg rounded-lg mt-3 sm:w-auto w-full sm:left-auto sm:top-auto sm:mt-2 sm:min-w-max sm:flex sm:flex-col sm:items-start"
      style={{
        minWidth: "max-content", // Ajusta el submenú al contenido
      }}
    >
      {subMenu.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className="block px-4 py-2 text-black hover:bg-[#0a5ba9] hover:text-white rounded-lg cursor-pointer"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )}
</div>


  );
};

export default NavMenu;
