import { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { getRequest, deleteRequest } from "../Server/Api";
import AddUsuarioModal from "../components/Modal/AddUsuarioModal";

interface Usuario {
  id: number;
  nombres: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  dni: string;
  rol: string;
}

interface ApiResponse {
  success: boolean;
  data: Usuario[];
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [cantidadPorPagina, setCantidadPorPagina] = useState<number>(10);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [showAddUsuarioModal, setShowAddUsuarioModal] = useState(false);
  const [busquedaDni, setBusquedaDni] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No estás autenticado");
        setLoading(false);
        return;
      }
      try {
        const response = await getRequest<ApiResponse>("/admin/users", token);
        if (response?.success && Array.isArray(response.data) && isMounted) {
          setUsuarios(response.data);
        } else {
          setError("Error al obtener usuarios");
        }
      } catch (error) {
        setError("Error al obtener los usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCantidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCantidadPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  const handlePageChange = (page: number) => setPaginaActual(page);
  const handlePreviousPage = () => paginaActual > 1 && setPaginaActual(paginaActual - 1);
  const handleNextPage = () => paginaActual < totalPages && setPaginaActual(paginaActual + 1);

  const totalPages = Math.ceil(usuarios.length / cantidadPorPagina);

  const usuariosFiltrados = busquedaDni
    ? usuarios.filter((usuario) => usuario.dni.includes(busquedaDni))
    : usuarios;

  const usuariosPorPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * cantidadPorPagina,
    paginaActual * cantidadPorPagina
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-lg font-bold text-center text-[#1a2850]">Listado de Usuarios</h1>
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="mr-2">Registros por página:</label>
          <select className="p-1 border rounded-md" value={cantidadPorPagina} onChange={handleCantidadChange}>
            {[2, 4, 8, 14, 20, 50].map((cantidad) => (
              <option key={cantidad} value={cantidad}>{cantidad}</option>
            ))}
          </select>
        </div>
        <button
          className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
          onClick={() => setShowAddUsuarioModal(true)}
        >
          <Plus size={18} className="mr-2" /> Añadir usuario
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          className="px-2 py-1 border rounded-md"
          placeholder="Buscar por DNI"
          value={busquedaDni}
          onChange={(e) => setBusquedaDni(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left bg-[#1a2850] text-white border">Nombre</th>
              <th className="px-4 py-2 text-left bg-[#1a2850] text-white border">Apellido Paterno</th>
              <th className="px-4 py-2 text-left bg-[#1a2850] text-white border">Apellido Materno</th>
              <th className="px-4 py-2 text-left bg-[#1a2850] text-white border">DNI</th>
              <th className="px-4 py-2 text-left bg-[#1a2850] text-white border">Rol</th>
              <th className="px-4 py-2 text-center bg-[#1a2850] text-white border">Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">Cargando usuarios...</td>
              </tr>
            ) : usuariosPorPagina.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">No hay usuarios registrados.</td>
              </tr>
            ) : (
              usuariosPorPagina.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{usuario.nombres}</td>
                  <td className="px-4 py-2 border">{usuario.apellido_paterno || "N/A"}</td>
                  <td className="px-4 py-2 border">{usuario.apellido_materno || "N/A"}</td>
                  <td className="px-4 py-2 border">{usuario.dni}</td>
                  <td className="px-4 py-2 border">{usuario.rol}</td>
                  <td className="px-4 py-2 text-center border">
                    <button className="p-1 text-blue-500 hover:text-blue-700"><Eye size={18} /></button>
                    <button className="p-1 mx-2 text-yellow-500 hover:text-yellow-700"><Edit size={18} /></button>
                    <button className="p-1 text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Usuarios;
