import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../Server/Api'; // Asumimos que tienes esta función de API que hace la solicitud al backend

const Login = () => {
  // Estados para almacenar email, password, mensajes de error y estado de carga
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación previa antes de enviar el formulario
    if (!email || !password) {
      setError("Por favor ingresa tanto el correo electrónico como la contraseña.");
      return;
    }

    setLoading(true); // Se muestra "Cargando..." mientras se realiza la solicitud

    try {
      // Llamamos a la función loginUser pasándole email y password
      const data = await loginUser(email, password);

      setLoading(false); // Detener la carga

      // Verificamos si se recibió el token
      if (data.token) {
        // Guardamos el token en el localStorage
        localStorage.setItem('token', data.token);

        // Opcionalmente, también puedes guardar información del usuario si el backend la devuelve
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Navegamos a la página de inicio
        navigate('/home');
      } else {
        // Si no hay token, mostramos el mensaje de error retornado por el servidor
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setLoading(false);
      setError('Error al iniciar sesión');
      console.error('Login error:', err);
    }
  };

  // Redirigir a la página de registro
  const redirectToRegister = () => {
    navigate("/registro"); // Redirige a la página de registro
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/images/fondo-portal-web-cenate-2025.png')] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-900 mb-6">Login CENATE</h1>
        
        {/* Mostrar error si existe */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
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

          {/* Mostrar mensaje de carga */}
          {loading ? (
            <button
              type="button"
              className="w-full py-3 px-6 bg-[#2e63a6] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#2e63a6] hover:scale-105 focus:outline-none focus:ring-2"
            >
              Cargando...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#2e63a6] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#2e63a6] hover:scale-105 focus:outline-none focus:ring-2"
            >
              Iniciar sesión
            </button>
          )}
        </form>

        {/* Enlace a "Olvidaste tu contraseña" */}
        <div className="flex justify-center items-center mt-4">
          <Link
            to="/forgot-password"
            className="text-sm text-[#2e63a6] hover:text-blue-500 underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Enlace a página de registro */}
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
          className="w-full p-3 mt-4 bg-green-700 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear una cuenta
        </button>
      </div>
    </div>
  );
};

export default Login;
