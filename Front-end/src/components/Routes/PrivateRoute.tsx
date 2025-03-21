import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // ✅ Parsea el objeto usuario

  if (!token) return <Navigate to="/login" replace />;

  // ✅ Permitir acceso total al Superadmin
  if (user.rol === "Superadmin") return <Outlet />;

  // ✅ Verificar si el usuario tiene un rol válido
  if (!user.rol || !allowedRoles.includes(user.rol)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PrivateRoute;
