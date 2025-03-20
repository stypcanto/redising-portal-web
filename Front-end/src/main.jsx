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
import NavMenu from "./components/Nav/Nav_menu"; // ✅ Ruta corregida
import GestionTerritorial from "./Pages/Gestionterritorial";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontró el elemento #root en index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* ✅ Layout principal */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="portaladmin" element={<PortalAdmin />} />
          <Route path="portalmedico" element={<PortalMedico />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="gestionterritorial" element={<GestionTerritorial />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="navmenu" element={<NavMenu />} />
        </Route>

        {/* ✅ Página 404 */}
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
