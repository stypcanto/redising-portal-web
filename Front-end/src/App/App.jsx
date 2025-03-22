import { Outlet } from "react-router-dom";
import Menu from "../components/Menu/Menu.jsx";
import { useEffect, useState } from "react";

const SessionTimeout = ({ onLogout }) => {
  const [warning, setWarning] = useState(false);
  let timeout;
  let warningTimeout;

  // Función para resetear el temporizador de inactividad
  const resetTimer = () => {
    clearTimeout(timeout);
    clearTimeout(warningTimeout);
    setWarning(false);

    // Después de 2 minutos (120000ms), mostrar advertencia
    warningTimeout = setTimeout(() => {
      setWarning(true);

      // Si no responde en 30s, cerrar sesión
      timeout = setTimeout(() => {
        onLogout();
      }, 30000); // 30s
    }, 120000); // 2 min
  };

  useEffect(() => {
    resetTimer();

    // Detectar actividad del usuario
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearTimeout(timeout);
      clearTimeout(warningTimeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  return (
    warning && (
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <p className="text-lg font-bold">⚠ Sesión a punto de expirar</p>
          <p>Por inactividad, serás desconectado en 30 segundos.</p>
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
            onClick={resetTimer}
          >
            Seguir conectado
          </button>
        </div>
      </div>
    )
  );
};

const App = () => {
  console.log("✅ API_URL:", import.meta.env.VITE_API_URL);

  const logout = () => {
    localStorage.removeItem("token"); // Borra el token
    window.location.href = "/login"; // Redirige al login
  };

  return (
    <>
      <Menu />
      <SessionTimeout onLogout={logout} /> {/* ⬅ Añadir aquí */}
      <Outlet />
    </>
  );
};

export default App;
