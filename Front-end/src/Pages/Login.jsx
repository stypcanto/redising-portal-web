import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../Server/Api';

const Login = () => {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!dni || !password) {
      setError("Por favor, ingresa DNI y contraseña.");
      return;
    }

    try {
      const data = await loginUser(dni, password);

      if (data.token) {
        sessionStorage.setItem("token", data.token); // Mejor que localStorage

        if (data.user) {
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }

        navigate('/portaladmin');
      } else {
        setError(data.message || "Credenciales incorrectas.");
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

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#2e63a6] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#2e63a6] hover:scale-105 focus:outline-none focus:ring-2"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <Link to="/forgot-password" className="text-sm text-[#2e63a6] hover:text-blue-500 underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

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
