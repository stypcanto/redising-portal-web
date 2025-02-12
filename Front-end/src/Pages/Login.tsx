import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../Server/Api';  // Asumimos que tienes esta función de API que hace la solicitud al backend

const Login = () => {
  // Estados para almacenar email, password y mensajes de error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleLogin = async (e: React.FormEvent) => { // Hacemos esta función async
    e.preventDefault();

    try {
      // Llamamos a la función loginUser pasándole email y password
      const data = await loginUser(email, password);

      // Verificamos si se recibió el token
      if (data.token) {
        // Guardamos el token en el localStorage
        localStorage.setItem('token', data.token);

        // Opcionalmente, también puedes guardar información del usuario si el backend la devuelve
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Navegamos a la página de inicio (o la que desees)
        navigate('/portaladmin');
      } else {
        // Si no hay token, mostramos el mensaje de error retornado por el servidor
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      // Si ocurre un error en la solicitud
      setError('Error al iniciar sesión');
      console.error('Login error:', err);
    }
  };

  const redirectToRegister = () => {
    alert("Redirigiendo a registro...");  // Verifica si se ejecuta
    navigate("/registro");  // Redirige a la página de registro
  };
  

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/images/fondo-portal-web-cenate-2025.png')] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold text-center text-blue-900">Login CENATE</h1>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
          <Link
            to="/forgot-password"
            className="text-sm text-[#2e63a6] hover:text-blue-500 underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            ¿No tienes una cuenta?{" "}
            <strong 
              className="text-[#2e63a6] cursor-pointer"
              onClick={redirectToRegister}
            >
              Únete gratis
            </strong>
          </p>
        </div>

        <button 
          type="button" 
          onClick={redirectToRegister} 
          className="w-full p-3 mt-4 text-white bg-green-700 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear una cuenta
        </button>
      
      </div>
    </div>
  );
};

export default Login;
