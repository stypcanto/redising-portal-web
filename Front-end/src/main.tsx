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
import Roles from "./Pages/Roles";  

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

          {/* ✅ Unifica acceso a PortalAdmin para "Administrador" y "Usuario" */}
          <Route element={<PrivateRoute allowedRoles={["Administrador", "Usuario"]} />}>
            <Route path="portaladmin" element={<PortalAdmin />} />
          </Route>

          {/* ✅ Ruta para Superadmin */}
          <Route element={<PrivateRoute allowedRoles={["Superadmin"]} />}>
      <Route path="/superadmin" element={<SuperadminPage />}>
        <Route path="roles" element={<Roles />} /> {/* ✅ Contenido dinámico */}
      </Route>
    </Route>


        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
 
        {/* ✅ Página 404 */}
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
