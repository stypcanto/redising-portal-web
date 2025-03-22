import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600">⛔ Acceso Denegado</h1>
      <p className="mt-4 text-lg text-gray-700">
        No tienes permisos para acceder a esta página.
      </p>
      <Link
        to="/"
        className="px-4 py-2 mt-6 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
