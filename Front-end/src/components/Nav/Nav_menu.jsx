import { useState } from "react";
import { Menu, MenuButton, MenuDivider, MenuItem, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { Link } from "react-router-dom";

function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0a5ba9] text-white py-4 px-6 fixed top-0 w-full z-50 shadow-lg flex justify-between items-center">
      {/* Menú hamburguesa en móviles */ }
      <button className="text-2xl text-white sm:hidden" onClick={ () => setIsOpen(!isOpen) }>
        ☰
      </button>

      {/* Menús a la izquierda */ }
      <div
        className={ `sm:flex sm:space-x-6 absolute sm:static mt-10 top-16 left-0 w-full sm:w-auto bg-[#0a5ba9] sm:bg-transparent p-4 sm:p-0 shadow-lg sm:shadow-none transition-all duration-300 ${isOpen ? "flex flex-col" : "hidden"}` }
      >
        <Menu menuButton={ <MenuButton className="px-4 py-2 text-white rounded-sm">Información Asistencial</MenuButton> }>
          <MenuItem><Link to="/PortalMedico">Portal Médico</Link></MenuItem>
          <MenuItem><Link to="/listadopersonal">Listado Personal</Link></MenuItem>
        </Menu>

        <Menu menuButton={ <MenuButton className="px-4 py-2 text-white rounded-sm">Información Administrativa</MenuButton> }>
          <SubMenu label="Dirección General">
            <MenuItem><Link to="/gestion-procesos">Gestión de Procesos</Link></MenuItem>
            <MenuItem><Link to="/gestion-reputacion">Gestión de la Reputación</Link></MenuItem>
          </SubMenu>

          <SubMenu label="SDGT">
            <MenuItem><Link to="/gestores-territoriales">Gestores Territoriales</Link></MenuItem>
            <SubMenu label="Coordinadores de área">
              <MenuItem><Link to="/coordinador-general">Coordinador General</Link></MenuItem>
              <MenuItem><Link to="/coordinadores-gcitas">Coordinadores de Gestión de Citas</Link></MenuItem>
              <MenuItem><Link to="/coordinadores-tc-to">Coordinadores de TC/TO/TINT</Link></MenuItem>
              <MenuItem><Link to="/coordinadores-tm-tu">Coordinadores de TM/TU</Link></MenuItem>
              <MenuItem><Link to="/coordinadores-tad">Coordinadores de TAD</Link></MenuItem>
            </SubMenu>
          </SubMenu>

          <SubMenu label="SDRIST">
            <MenuItem><Link to="/diseno-institucional">Diseño Institucional</Link></MenuItem>
            <MenuItem><Link to="/proyectos-disruptivos">Proyectos Disruptivos</Link></MenuItem>
            <MenuItem><Link to="/gestion-datos">Gestión de Datos</Link></MenuItem>
          </SubMenu>

          <SubMenu label="Dirección de Despacho">
            <MenuItem><Link to="/rrhh">Recursos Humanos</Link></MenuItem>
            <MenuItem><Link to="/abastecimiento">Abastecimiento</Link></MenuItem>
            <MenuItem><Link to="/planeamiento">Planeamiento</Link></MenuItem>
            <MenuItem><Link to="/presupuesto">Presupuesto</Link></MenuItem>
            <MenuItem><Link to="/contable">Contabilidad</Link></MenuItem>
          </SubMenu>
        </Menu>

        <Menu menuButton={ <MenuButton className="px-4 py-2 text-white rounded-sm">Cuenta</MenuButton> }>
          <MenuItem disabled><Link to="#">Editar Perfil</Link></MenuItem>
          <MenuDivider />
          <MenuItem><Link to="/">Cerrar Sesión</Link></MenuItem>
        </Menu>
      </div>

      {/* Logo a la derecha */ }
      <img src="/images/LOGOESSALUD.png" alt="Logo" className="w-40 h-auto" />
    </nav>
  );
}

export default NavMenu;
