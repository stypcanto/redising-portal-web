import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();


    // Validación simple para verificar el email
    if (!email) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    // Simulación de solicitud de recuperación de contraseña
    // Aquí iría la lógica para enviar el correo de recuperación
    setMessage("Te hemos enviado un correo con instrucciones para restablecer tu contraseña.");
    setError("");
  };

  const redirectToLogin = () => {
    navigate("/login");  // Redirige a la página de login
  };

  return (
    <div className="min-h-screen   bg-cover bg-center  bg-[url('/images/fondo-portal-web-cenate-2025.png')] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold text-center text-blue-900">Recuperar Contraseña</h1>
        {message && <p className="mb-4 text-center text-green-500">{message}</p>}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input 
              type="email" 
              placeholder="Introduce tu correo electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#2e63a6] text-white text-sm font-semibold rounded-lg shadow-md transform transition-all duration-300 hover:bg-[#2e63a6] hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2"
          >
            Enviar correo de recuperación
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            ¿Recuperaste tu cuenta?{" "}
            <strong
              className="text-[#2e63a6] cursor-pointer"
              onClick={redirectToLogin}
            >
              Inicia sesión aquí
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
