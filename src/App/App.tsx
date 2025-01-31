import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importa BrowserRouter y Routes

import Home from "../Pages/Home"; // Página principal
import PortalMedico from "../Pages/PortalMedico"; // Página Portal Medico
import Login from "../Pages/Login";
import Redireccion from "../Pages/Redireccion";
import Registro from "../Pages/Registro";
import ForgotPassword from "../Pages/ForgotPassword";
//import Institucional from "../Pages/Institucional"; // Página Institucional
//import Telegestion from "../Pages/Telegestion"; // Página Telegestión

const App: React.FC = () => {
  return (
    <BrowserRouter> {/* Envolvemos todo en BrowserRouter para manejar las rutas */}
      <Routes>
      <Route path="/" element={<Home />} /> {/* Página principal */}
        <Route path="/login" element={<Login />} /> {/* Página de Login */}
        <Route path="/registro" element={<Registro />} /> {/* Página de Registro */}
        <Route path="/redireccion" element={<Redireccion />} /> {/* Página de redirección */}
        <Route path="/medicos" element={<PortalMedico />} /> {/* Página de Médicos */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/*<Route path="/institucional" element={<Institucional />} /> {/* Página Institucional */}
        {/*<Route path="/telegestion" element={<Telegestion />} /> {/* Página Telegestión */}
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
