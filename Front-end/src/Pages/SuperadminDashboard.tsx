import { useEffect, useState } from "react";

const SuperadminDashboard = () => {
   


  // Funcion para agregar el nombre de la personal en el Panel
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
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
          if (response.status === 401 || response.status === 403) {
            console.warn("🚨 Token inválido. Cerrando sesión...");
            localStorage.removeItem("token"); // Eliminar token si es inválido
            window.location.href = "/login"; // Redirigir al login
            return;
          }
          throw new Error(`❌ Error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        console.log("✅ Respuesta completa de la API:", JSON.stringify(data, null, 2));

        // Extrae correctamente el nombre
        if (data.success && data.user) {
          const nombre = data.user.nombres?.trim() || "Usuario";
          console.log("📌 Nombre extraído:", nombre);
          setUserName(nombre);
        } else {
          console.warn("⚠️ No se pudo obtener el nombre del usuario.");
        }
      } catch (error) {
        console.error("⚠️ Error al obtener el usuario:", error.message);
      }
    };

    fetchUserData();
  }, []); // 🔹 Se mantiene la dependencia vacía para que se ejecute una sola vez

  
  return (
      <main className="flex flex-col items-center flex-grow p-4 mt-20 overflow-y-auto sm:p-6">
        <div className="w-full max-w-4xl p-6">
          <h1 className="mb-4 text-lg font-bold text-center text-[#1a2850] sm:text-2xl">
            Panel de Administración
          </h1>
          <p className="text-center text-gray-700">
            Bienvenido  <span className="text-[#ff8c00]">{userName}</span>  al panel de administración. Utiliza el menú para gestionar la administración del Portal Web.
          </p>
        </div>
      </main>
    );
  };
  
  export default SuperadminDashboard;
  