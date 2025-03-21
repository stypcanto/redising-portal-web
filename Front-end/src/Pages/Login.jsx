import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Server/Api";

const Login = () => {
  const [dni, setDni] = useState(""); // Estado para almacenar el DNI ingresado
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [error, setError] = useState(""); // Estado para manejar errores en el login
  const navigate = useNavigate();

  // Maneja la autenticación al hacer submit del formulario
  const handleLogin = async (e) => { 
    e.preventDefault();
   // Previene la recarga de la página

   console.log("📌 DNI ingresado:", dni);
   console.log("📌 Contraseña ingresada:", password);

    if (!dni || !password) {
      setError("Por favor, ingresa DNI y contraseña."); // Muestra error si faltan datos
      return;
    }

    try {
      const data = await loginUser(dni, password); // Llama a la API para autenticar

      if (data?.success && data.token && data.user?.rol) {
        // ✅ Guarda en localStorage solo los datos esenciales
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.user.rol); // Guarda el rol en localStorage

        // ✅ Redirige al usuario según su rol
        switch (data.user.rol) {
          case "Superadmin":
            navigate("/superadmin");
            break;
          case "Administrador":
            navigate("/portaladmin");
            break;
          default:
            navigate("/usuario"); // Redirige a usuarios regulares
            break;
        }
      } else {
        setError(data?.message || "Credenciales incorrectas."); // Muestra error si la autenticación falla
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Hubo un problema en el servidor. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/images/fondo-portal-web-cenate-2025.png')] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold text-center text-blue-900">Login CENATE</h1>

        {/* Muestra errores en caso de fallos */}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="DNI" 
              value={dni} 
              onChange={(e) => setDni(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón para iniciar sesión */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#2e63a6] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#2e63a6] hover:scale-105 focus:outline-none focus:ring-2"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace para recuperar contraseña */}
        <div className="flex items-center justify-center mt-4">
          <Link to="/forgot-password" className="text-sm text-[#2e63a6] hover:text-blue-500 underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Enlace para registrarse */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            ¿No tienes una cuenta?{" "}
            <span 
              className="text-[#2e63a6] cursor-pointer font-semibold"
              onClick={() => navigate("/registro")}
            >
              Únete gratis
            </span>
          </p>
        </div>

        {/* Botón para registrarse */}
        <button 
          type="button" 
          onClick={() => navigate("/registro")} 
          className="w-full p-3 mt-4 text-white bg-green-700 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear una cuenta
        </button>
      </div>
    </div>
  );
};

export default Login;
