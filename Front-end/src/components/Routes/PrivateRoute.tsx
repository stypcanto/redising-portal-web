import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null"); // ✅ Intenta parsear el usuario
  } catch (error) {
    console.error("❌ Error al leer el usuario de localStorage:", error);
  }

  // 🚫 Si no hay token, redirigir a login
  if (!token) {
    console.warn("🔒 Usuario no autenticado. Redirigiendo a login...");
    return <Navigate to="/login" replace />;
  }

  // 🚫 Si no hay usuario o su estructura es inválida, redirigir a login
  if (!user || !user.rol) {
    console.warn("⚠️ Usuario inválido o sin rol. Redirigiendo a login...");
    return <Navigate to="/login" replace />;
  }

  // ✅ Verificar si el rol del usuario está en la lista permitida
  if (!allowedRoles.includes(user.rol)) {
    console.warn(`⛔ Acceso denegado. El rol "${user.rol}" no tiene permisos.`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
