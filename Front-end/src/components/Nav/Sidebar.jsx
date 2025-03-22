import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronDown, ChevronRight, Users, Settings, FileBarChart2, Wrench, LogOut 
} from "lucide-react"; 

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({
    personas: false,
    configuraciones: false,
    ajustes: false,
  });

  const navigate = useNavigate(); 

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    navigate("/login"); 
  };

  return (
    <div className="w-64 min-h-screen p-4 bg-white shadow-md fixed left-0 top-[80px] z-0 flex flex-col justify-between">
      <div className="flex-1 overflow-auto">
        <h2 className="p-2 mb-4 text-lg font-bold text-center text-gray-600">
          Panel
        </h2>

        <nav className="space-y-2">
          <div>
            <button
              className="flex items-center justify-between w-full p-2 font-semibold text-left text-gray-600 rounded hover:bg-[#1a2850] hover:text-white"
              onClick={() => toggleSection("personas")}
            >
              <span className="flex items-center">
                <Users className="mr-2" size={18} /> Personas
              </span> 
              {openSections.personas ? <ChevronDown /> : <ChevronRight />}
            </button>
            {openSections.personas && (
              <div className="pl-4 mt-2 space-y-1">
                <Link to="/superadmin/roles" className="flex items-center p-2 text-sm text-gray-600 rounded hover:bg-[#1a2850] hover:text-white">
                  <Users className="mr-2" size={16} /> Roles
                </Link>
                <Link to="/superadmin/usuarios" className="flex items-center p-2 text-sm text-gray-600 rounded hover:bg-[#1a2850] hover:text-white">
                  <Users className="mr-2" size={16} /> Usuarios
                </Link>
                <Link to="/superadmin/establecer-roles" className="flex items-center p-2 text-sm text-gray-600 rounded hover:bg-[#1a2850] hover:text-white">
                  <Users className="mr-2" size={16} /> Establecer Roles
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              className="flex items-center justify-between w-full p-2 font-semibold text-left text-gray-600 rounded hover:bg-[#1a2850] hover:text-white"
              onClick={() => toggleSection("configuraciones")}
            >
              <span className="flex items-center">
                <Settings className="mr-2" size={18} /> Configuraciones
              </span> 
              {openSections.configuraciones ? <ChevronDown /> : <ChevronRight />}
            </button>
            {openSections.configuraciones && (
              <div className="pl-4 mt-2 space-y-1">
                <Link to="/actualizar-portal-medico" className="flex items-center p-2 text-sm text-gray-600 rounded hover:bg-[#1a2850] hover:text-white">
                  <Settings className="mr-2" size={16} /> Actualizar portal médico
                </Link>
                <Link to="/actualizar-portal-administrativo" className="flex items-center p-2 text-sm text-gray-600 rounded hover:bg-[#1a2850] hover:text-white">
                  <Settings className="mr-2" size={16} /> Actualizar portal administrativo
                </Link>
              </div>
            )}
          </div>

          <div>
            <Link to="/reportes" className="flex items-center w-full p-2 font-semibold text-left text-gray-600 rounded hover:bg-[#1a2850] hover:text-white">
              <FileBarChart2 className="mr-2" size={18} /> Reportes
            </Link>
          </div>

          <div>
            <button
              className="flex items-center justify-between w-full p-2 font-semibold text-left text-gray-600 rounded hover:bg-[#1a2850] hover:text-white"
              onClick={() => toggleSection("ajustes")}
            >
              <span className="flex items-center">
                <Wrench className="mr-2" size={18} /> Ajustes
              </span> 
              {openSections.ajustes ? <ChevronDown /> : <ChevronRight />}
            </button>
            {openSections.ajustes && (
              <div className="pl-4 mt-2 space-y-1">
                <Link to="/actualizar-perfil" className="flex items-center p-2 text-sm text-gray-600 rounded hover:bg-[#1a2850] hover:text-white">
                  <Wrench className="mr-2" size={16} /> Actualizar perfil
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full p-2 font-semibold text-left text-red-600 rounded mb-38 hover:bg-red-600 hover:text-white"
        >
          <span className="flex items-center">
            <LogOut className="mr-2" size={18} /> Cerrar sesión
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
