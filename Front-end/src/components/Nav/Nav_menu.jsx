import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importar useNavigate
import { Menu, MenuButton, MenuDivider, MenuItem, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

function NavMenu({ onSelectSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Definir la función de navegación

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      { isOpen && <div className="fixed inset-0 z-40 bg-black opacity-50 md:hidden" onClick={ closeMenu }></div> }

      <nav className="bg-[#0a5ba9] text-white py-5 px-6 fixed top-0 w-full z-50 shadow-lg flex items-center justify-between">
        <img src="/images/LOGOCENATE1.png" alt="Logo" className="w-40 h-auto md:hidden lg:block" />

        <button className="z-50 text-2xl text-white lg:hidden" onClick={ toggleMenu }>
          { isOpen ? <FaTimes /> : <FaBars /> }
        </button>

        <div
          className={ `fixed md:static top-0 right-0 h-full w-64 md:w-auto bg-[#0a5ba9] md:flex md:items-center md:space-x-6 p-6 md:p-0 shadow-lg md:shadow-none transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
            } md:translate-x-0 z-50` }
        >
          <Menu menuButton={ <MenuButton className="flex items-center px-5 py-2 text-white rounded-sm hover:bg-[#083e77]">
            Información Asistencial <FaChevronDown className="ml-2" />
          </MenuButton> }>
            <MenuItem onClick={ () => { onSelectSection("PortalMedico"); closeMenu(); } }>Portal Médico</MenuItem>
            <MenuItem onClick={ () => { onSelectSection("ListadoPersonal"); closeMenu(); } }>Listado Personal</MenuItem>
          </Menu>

          <Menu menuButton={ <MenuButton className="flex items-center px-4 py-2 text-white rounded-sm hover:bg-[#083e77]">
            Información Administrativa <FaChevronDown className="ml-2" />
          </MenuButton> }>
            <SubMenu label="Dirección General">
              <MenuItem onClick={ () => { onSelectSection("GestionProcesos"); closeMenu(); } }>Gestión de Procesos</MenuItem>
              <MenuItem onClick={ () => { onSelectSection("GestionReputacion"); closeMenu(); } }>Gestión de la Reputación</MenuItem>
            </SubMenu>

            <SubMenu label="SDGT">
              <MenuItem onClick={ () => { onSelectSection("GestoresTerritoriales"); closeMenu(); } }>Gestores Territoriales</MenuItem>
              <SubMenu label="Coordinadores de área">
                <MenuItem onClick={ () => { onSelectSection("CoordinadorGeneral"); closeMenu(); } }>Coordinador General</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadoresGCitas"); closeMenu(); } }>Coordinadores de Gestión de Citas</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadoresTCTO"); closeMenu(); } }>Coordinadores de TC/TO/TINT</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadoresTMTU"); closeMenu(); } }>Coordinadores de TM/TU</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadoresTAD"); closeMenu(); } }>Coordinadores de TAD</MenuItem>
              </SubMenu>
            </SubMenu>

            <SubMenu label="SDRIST">
              <MenuItem onClick={ () => { onSelectSection("DisenoInstitucional"); closeMenu(); } }>Diseño Institucional</MenuItem>
              <MenuItem onClick={ () => { onSelectSection("ProyectosDisruptivos"); closeMenu(); } }>Proyectos Disruptivos</MenuItem>
              <MenuItem onClick={ () => { onSelectSection("GestionDatos"); closeMenu(); } }>Gestión de Datos</MenuItem>
            </SubMenu>

            <SubMenu label="Dirección de Despacho">
              <MenuItem onClick={ () => { onSelectSection("RRHH"); closeMenu(); } }>Recursos Humanos</MenuItem>
              <MenuItem onClick={ () => { onSelectSection("Abastecimiento"); closeMenu(); } }>Abastecimiento</MenuItem>
              <MenuItem onClick={ () => { onSelectSection("Planeamiento"); closeMenu(); } }>Planeamiento</MenuItem>
              <MenuItem onClick={ () => { onSelectSection("Presupuesto"); closeMenu(); } }>Presupuesto</MenuItem>
              <MenuItem onClick={ () => { onSelectSection("Contable"); closeMenu(); } }>Contabilidad</MenuItem>
            </SubMenu>
          </Menu>

          <Menu menuButton={ <MenuButton className="flex items-center px-4 py-2 text-white rounded-sm hover:bg-[#083e77]">
            Cuenta <FaChevronDown className="ml-2" />
          </MenuButton> }>
            <MenuItem disabled onClick={ closeMenu }>Editar Perfil</MenuItem>
            <MenuDivider />
            <MenuItem onClick={ () => {
              closeMenu();
              navigate("/"); // ✅ Redirigir a la página de inicio
            } }>Cerrar Sesión</MenuItem>

          </Menu>
        </div>

        <img src="/images/LOGOESSALUD.png" alt="Logo" className="hidden w-40 h-auto md:block" />
      </nav>
    </>
  );
}

export default NavMenu;
