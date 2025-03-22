import { Outlet } from "react-router-dom";
import Nav_admin from "../components/Nav/Nav_admin";
import Footer_azul from "../components/Footer/Footer_azul";
import Sidebar from "../components/Nav/Sidebar";

const SuperadminPage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Nav_admin />

      {/* Contenedor principal */}
      <div className="flex flex-grow gap-x-4">
        {/* Sidebar con altura completa */}
        <div className="flex-shrink-0 w-64 min-h-screen bg-white shadow-lg">
          <Sidebar />
        </div>

        {/* Contenido dinámico dentro del Panel */}
        <main className="flex flex-col flex-grow p-4 mt-20 overflow-auto sm:p-6">
          <Outlet /> {/* ✅ Aquí se cargará la vista de Roles */}
        </main>
      </div>

      {/* Footer */}
      <Footer_azul />
    </div>
  );
};

export default SuperadminPage;
