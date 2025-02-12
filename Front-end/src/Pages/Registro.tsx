import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from '../Server/Api';

const Registro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(""); // Agregar estado para éxito
  const navigate = useNavigate();

  const inputStyle =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();

    // Validación de campos
  if (!username || !email || !password || !confirmPassword) {
    setError("Por favor ingresa todos los campos.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Las contraseñas no coinciden.");
    return;
  }

  // Validación de formato de email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    setError("Por favor ingresa un email válido.");
    return;
  }

  // Verifica que el campo username no esté vacío
  if (!username.trim()) {
    setError("Por favor ingresa un nombre de usuario válido.");
    return;
  }

  setLoading(true);
  setError(""); // Limpiar cualquier error previo

  try {
    const data = await registerUser(username, email, password);
    setLoading(false);

    if (data.success) {
      setSuccess("Usuario registrado con éxito. Redirigiendo al login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(data.message || "Error al registrar usuario.");
    }
  } catch (err) {
    setLoading(false);
    setError("Hubo un error al registrar el usuario.");
    console.error("Register error:", err);
  }
};

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/images/fondo-portal-web-cenate-2025.png')] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold text-center text-blue-900">Registro CENATE</h1>

        {/* Mostrar mensaje de éxito si existe */}
        {success && <p className="mb-4 text-center text-green-500">{success}</p>}

        {/* Mostrar error si existe */}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputStyle}
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
              Registrarse
            </button>
          )}
        </form>

        {/* Enlace para redirigir al login si ya tienes cuenta */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            ¿Ya tienes una cuenta?{" "}
            <strong
              className="text-[#2e63a6] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
