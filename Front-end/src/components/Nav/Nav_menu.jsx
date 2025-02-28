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
          <Menu menuButton={ <MenuButton className="flex text-sm  items-center px-4 py-2 text-white rounded-sm hover:bg-[#083e77]">
            Información Asistencial <FaChevronDown className="ml-2" />
          </MenuButton> }>
            <MenuItem onClick={ () => { onSelectSection("PortalMedico"); closeMenu(); } }>Portal Médico</MenuItem>
            <MenuItem onClick={ () => { onSelectSection("ListadoPersonal"); closeMenu(); } }>Listado Personal</MenuItem>
          </Menu>

          <Menu menuButton={ <MenuButton className="flex text-sm  items-center px-4 py-2 text-white rounded-sm hover:bg-[#083e77]">
            Información Administrativa <FaChevronDown className="ml-2" />
          </MenuButton> }>
            <SubMenu label="Dirección General">
              <SubMenu label="Responsable de la calidad">
                <MenuItem onClick={ () => { onSelectSection("GestionProceso"); closeMenu(); } }>
                  <a
                    href="https://segurosocialdesalud-my.sharepoint.com/:f:/g/personal/cenate_calidad_essalud_gob_pe/Etc8PQQ_TTVNjHh2TrpnQaIB0BlsWpemTUhRmWYDt6P79w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    Gestión de Procesos y Mejora Continua
                  </a>
                </MenuItem>

              </SubMenu>
              <SubMenu label="Responsable de Imagen y Comunicación">
                <MenuItem onClick={ () => { onSelectSection("ResponsableReputacion"); closeMenu(); } }>
                  <a
                    href="https://segurosocialdesalud-my.sharepoint.com/:f:/g/personal/cenate_calidad_essalud_gob_pe/EqB0QoX5zwhBrnldoH12_cYBc6OKKNT0LIK6yxVfmwf62Q"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    Gestión de la Reputación
                  </a>

                </MenuItem>
              </SubMenu>
            </SubMenu>

            <SubMenu label="SDGT">
              <MenuItem onClick={ () => { onSelectSection("GestionTerritorial"); closeMenu(); } }>
                Gestores Territoriales
              </MenuItem>

              <SubMenu label="Coordinadores de área">
                <MenuItem onClick={ () => { onSelectSection("CoordinadorGeneral"); closeMenu(); } }>Coordinador General</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadoresGCitas"); closeMenu(); } }>Coordinadores de Gestión de Citas</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadoresTCTO"); closeMenu(); } }>Coordinadores de TC/TO/TINT</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadoresTMTU"); closeMenu(); } }>Coordinadores de TM/TU</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadoresTAD"); closeMenu(); } }>Coordinadores de TAD</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadorTI"); closeMenu(); } }>Coordinadores TI</MenuItem>
                <MenuItem onClick={ () => { onSelectSection("CoordinadorTelecapaTeleIEC"); closeMenu(); } }>Coordinador Telecapacitación y TeleIEC</MenuItem>

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

          <Menu menuButton={ <MenuButton className="flex text-sm  items-center px-4 py-2 text-white rounded-sm hover:bg-[#083e77]">
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
