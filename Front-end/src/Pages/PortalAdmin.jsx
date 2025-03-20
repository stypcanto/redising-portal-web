import { useState, useEffect } from "react";
import Footer_azul from "../components/Footer/Footer_azul";
import NavTransversal from "../components/Nav/Nav_transversal";
import NavMenu from "../components/Nav/Nav_menu";
import PortalMedico from "./PortalMedico";
import GestionTerritorial from "./Gestionterritorial";

const PortalAdmin = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    let isMounted = true; // Evita actualizaciones en componentes desmontados
    console.log("📌 Ejecutando fetchUserData()...");

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.error("❌ No hay token en localStorage. Debes iniciar sesión.");
        return;
      }
    
      console.log("🔍 Token enviado:", token);
    
      try {
        const response = await fetch("http://localhost:5001/portaladmin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log("🔄 Estado de la respuesta:", response.status);
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`❌ Error ${response.status}: ${errorText}`);
        }
    
        const data = await response.json();
        console.log("✅ Datos recibidos de la API:", data);
    
        // Asegurar que `data` tiene el formato correcto antes de acceder a `nombres`
        if (data && typeof data === "object") {
          const nombre = data.nombres || data.user?.nombres || "Usuario"; // Intenta varias rutas posibles
          console.log("📌 Nombre extraído:", nombre);
    
          setUserName(nombre.trim());
        } else {
          console.warn("⚠️ Respuesta inesperada de la API:", data);
        }
      } catch (error) {
        console.error("⚠️ Error al obtener el usuario:", error.message);
      }
    };
    

    fetchUserData();

    return () => {
      isMounted = false; // Evita actualizaciones en componentes desmontados
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* ✅ Barra de navegación superior */}
      <NavMenu
        onSelectSection={(section) => {
          if (section === "PortalMedico") {
            setSelectedSection(<PortalMedico />);
          } else if (section === "GestionTerritorial") {
            setSelectedSection(<GestionTerritorial />);
          } else {
            setSelectedSection(null);
          }
        }}
      />

      <div className="flex flex-col flex-1 h-full lg:flex-row">
        {/* ✅ Contenido principal */}
        <div className="relative flex items-center justify-center flex-1">
          {!selectedSection ? (
            <>
              {/* ✅ Imagen de fondo */}
              <div
                className="absolute inset-0 w-full h-full bg-center bg-cover"
                style={{ backgroundImage: "url('/images/CENATEANGULAR.png')" }}
              ></div>

              {/* ✅ Capa oscura para mejorar contraste */}
              <div className="absolute inset-0 bg-blue-100/80"></div>

              {/* ✅ Contenido central */}
              <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                <h1 className="mt-20 md:mt-14 lg:mt-0 text-2xl md:text-4xl font-bold text-[#1d4f8a] drop-shadow-lg max-w-[95%] md:max-w-[70%]">
                  ¡Bienvenido, <span className="text-[#ff8c00]">{userName}</span> al Portal de CENATE!
                </h1>
                <p className="mt-2 text-sm md:text-lg text-black drop-shadow max-w-[85%] md:max-w-[70%]">
                  Accede a la información y herramientas que necesitas. Por favor, 
                  selecciona una opción del menú para comenzar.
                </p>
              </div>
            </>
          ) : (
            selectedSection
          )}
        </div>

        {/* ✅ NavTransversal en escritorio */}
        <div className="flex-col flex-shrink-0 hidden shadow-lg lg:flex w-72">
          <NavTransversal />
        </div>
      </div>

      {/* ✅ NavTransversal para móviles */}
      <div className="w-full lg:hidden">
        <NavTransversal />
      </div>

      {/* ✅ Footer */}
      <Footer_azul />
    </div>
  );
};

export default PortalAdmin;
