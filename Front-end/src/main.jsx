import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App/App";
import Pagina404 from "./components/404/404.jsx";
import Home from "./Pages/Home";
import PortalMedico from "./Pages/PortalMedico";
import Login from "./Pages/Login";
import PortalAdmin from "./Pages/PortalAdmin";
import Registro from "./Pages/Registro";
import ForgotPassword from "./Pages/ForgotPassword";
import NavMenu from "./components/Nav/Nav_menu";
import GestionTerritorial from "./Pages/Gestionterritorial";
import SuperadminPage from "./Pages/SuperadminPage";
import PrivateRoute from "./components/Routes/PrivateRoute";
import UnauthorizedPage from "./Pages/UnauthorizedPage";
import UpdateRoles from "./Pages/UpdateRoles";
import SuperadminDashboard from "./Pages/SuperadminDashboard";
import Roles from "./Pages/Roles";
import Usuarios from "./Pages/Usuarios";



const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontró el elemento #root en index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="gestionterritorial" element={<GestionTerritorial />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="navmenu" element={<NavMenu />} />
          <Route path="portalmedico" element={<PortalMedico />} />

          {/* ✅ Ruta protegida para Administradores y Usuarios */}
          <Route element={<PrivateRoute allowedRoles={["Administrador", "Usuario"]} />}>
            <Route path="portaladmin" element={<PortalAdmin />} />
          </Route>

          {/* ✅ Rutas protegidas para Superadmin */}
          <Route element={<PrivateRoute allowedRoles={["Superadmin"]} />}>
  <Route path="superadmin" element={<SuperadminPage />}>
    <Route index element={<SuperadminDashboard />} /> {/* Vista principal */}
    <Route path="establecer-roles" element={<UpdateRoles />} />
    <Route path="roles" element={<Roles />} /> {/* ✅ Ahora se puede acceder a /superadmin/roles */}
    <Route path="usuarios" element={<Usuarios />} />

  </Route>
</Route>





        </Route>

        {/* ✅ Página de acceso no autorizado */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ✅ Página 404 */}
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
