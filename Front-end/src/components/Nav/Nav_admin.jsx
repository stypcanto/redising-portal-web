import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importar useNavigate
import { Menu, MenuButton, MenuDivider, MenuItem, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";


function NavMenu({ }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Definir la función de navegación

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      { isOpen && <div className="fixed inset-0 z-40 bg-black opacity-50 md:hidden" onClick={ closeMenu }></div> }

      <nav className="bg-[#0a5ba9] text-white py-6 px-14 fixed top-0 w-full z-50 shadow-lg flex items-center justify-between">
        <a href="/portaladmin">
          <img src="/images/LOGOCENATE1.png" alt="Logo" className="w-40 h-auto md:hidden lg:block" />
        </a>


        <button className="z-50 text-2xl text-white lg:hidden" onClick={ toggleMenu }>
          { isOpen ? <FaTimes /> : <FaBars /> }
        </button>

        <div
          className={ `fixed md:static top-0 text-sm right-0 h-full w-64 md:w-auto bg-[#0a5ba9] md:flex md:items-center md:space-x-6 p-6 md:p-0 shadow-lg md:shadow-none transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
            } md:translate-x-0 z-50` }
        >



        </div>

        <img src="/images/LOGOESSALUD.png" alt="Logo" className="hidden w-40 h-auto md:block" />
      </nav>
    </>
  );
}

export default NavMenu;
