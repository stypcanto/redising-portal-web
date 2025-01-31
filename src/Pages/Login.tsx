import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Asegúrate de importar useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@cenate.com" && password === "admin") {
      navigate("/redireccion");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  const redirectToRegister = () => {
    navigate("/registro");  // Redirige a la página de registro
  };

  const redirectToForgotPassword = () => {
    navigate("/forgot-password");  // Redirige a la página de recuperación de contraseña
  };

  return (
    <div className="min-h-screen bg-[#2e63a6] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-900 mb-6">Login CENATE</h1>
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

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#2e63a6] text-white text-sm font-semibold rounded-lg shadow-md transform transition-all duration-300 hover:bg-[#2e63a6] hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="flex justify-center items-center mt-4">
  <a 
    href="#"
    onClick={redirectToForgotPassword}  // Llama a la función para redirigir
    className="text-sm text-[#2e63a6] hover:text-blue-500 underline"
  >
    ¿Olvidaste tu contraseña?
  </a>
</div>


        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            ¿No tienes una cuenta?{" "}
            <strong className="text-[#2e63a6] cursor-pointer" onClick={redirectToRegister}>
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
