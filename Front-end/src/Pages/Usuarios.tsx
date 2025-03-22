import { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { getRequest, deleteRequest } from "../Server/Api";
import AddUsuarioModal from "../components/Modal/AddUsuarioModal";

// Definir la interfaz para la respuesta de la API
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
  const [cantidadPorPagina, setCantidadPorPagina] = useState<number>(10); // Estado para controlar la cantidad de datos por página
  const [paginaActual, setPaginaActual] = useState<number>(1); // Estado para manejar la página actual
  const [showModal, setShowModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);
  const [showAddUsuarioModal, setShowAddUsuarioModal] = useState(false); // Estado para controlar el modal de agregar usuario

  useEffect(() => {
    let isMounted = true;

    const fetchUsuarios = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No hay token en localStorage");
        setError("No estás autenticado");
        setLoading(false);
        return;
      }

      try {
        const response = await getRequest<ApiResponse>("/admin/users", token);
        if (response && response.success && Array.isArray(response.data)) {
          if (isMounted) {
            setUsuarios(response.data);
          }
        } else {
          setError("Error al obtener usuarios: Respuesta inválida");
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

  // Función para manejar el cambio de cantidad de elementos por página
  const handleCantidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCantidadPorPagina(Number(e.target.value));
    setPaginaActual(1); // Resetear a la primera página cuando se cambia la cantidad
  };

  // Obtener los usuarios a mostrar según la página actual y la cantidad por página
  const usuariosPorPagina = usuarios.slice(
    (paginaActual - 1) * cantidadPorPagina,
    paginaActual * cantidadPorPagina
  );

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setPaginaActual(page);
  };

  // Funciones para "Anterior" y "Siguiente"
  const handlePreviousPage = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleNextPage = () => {
    if (paginaActual < totalPages) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const openModal = (usuario: Usuario) => {
    setUsuarioAEliminar(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioAEliminar(null);
  };

  const handleAddUsuario = (nombres: string, apellidoPaterno: string, apellidoMaterno: string, dni: string, rol: string) => {
    const nuevoUsuario = {
      id: usuarios.length + 1, // Generar un ID único para el nuevo usuario
      nombres,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      dni,
      rol
    };
  
    setUsuarios([...usuarios, nuevoUsuario]); // Actualizar la lista de usuarios
  };
  
  

  // Función de eliminación
  const handleDelete = async (userId: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("❌ No hay token en localStorage");
      return;
    }

    try {
      // const response = await deleteRequest(`/admin/delete-user/${userId}`, token);
      const response = await deleteRequest(userId, token);  
      if (response.success) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.filter((user) => user.id !== userId)
        );
        setShowModal(false); // Cerrar el modal después de la eliminación
      } else {
        console.error("❌ Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("❌ Error en la eliminación:", error);
    }
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(usuarios.length / cantidadPorPagina);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-lg font-bold text-center text-[#1a2850]">Listado de Usuarios</h1>

      {/* Botón para Añadir Usuario - Movido a la parte superior izquierda */}
      <div className="flex justify-start ">
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
          onClick={() => setShowAddUsuarioModal(true)} // Abrir modal de añadir usuario
        >
          Añadir usuario
        </button>
      </div>

      {/* Modal para añadir un nuevo usuario */}
     
{showAddUsuarioModal && (
  <AddUsuarioModal
    showModal={showAddUsuarioModal}  // Cambia 'onClose' a 'showModal'
    handleClose={() => setShowAddUsuarioModal(false)}  // Cambia 'onClose' a 'handleClose'
    handleAddUser={handleAddUsuario}  // Cambia 'onAdd' a 'handleAddUser'
  />
)}


      {/* Selector de cantidad de entradas por página */}
      <div className="flex justify-end mb-4">
        <label htmlFor="cantidad" className="mr-2 text-sm text-[#1a2850]">
          Mostrar:
        </label>
        <select
          id="cantidad"
          className="px-2 py-1 border border-gray-300 rounded-md"
          value={cantidadPorPagina}
          onChange={handleCantidadChange}
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
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
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                  Cargando usuarios...
                </td>
              </tr>
            ) : usuariosPorPagina.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                  No hay usuarios registrados.
                </td>
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
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <Eye size={18} />
                    </button>
                    <button className="p-1 mx-2 text-yellow-500 hover:text-yellow-700">
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-1 text-red-500 hover:text-red-700"
                      onClick={() => openModal(usuario)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="px-4 py-2 text-blue-500 bg-white border rounded-md disabled:opacity-50"
          onClick={handlePreviousPage}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className={`px-4 py-2 rounded-md border ${paginaActual === page ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="px-4 py-2 text-blue-500 bg-white border rounded-md disabled:opacity-50"
          onClick={handleNextPage}
          disabled={paginaActual === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-30">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-[#1a2850] mb-4">
              ¿Estás seguro de eliminar este usuario?
            </h2>
            <p className="mb-4 text-gray-600">
              Esta acción no se puede deshacer. ¿Deseas continuar con la eliminación de{" "}
              {usuarioAEliminar?.nombres}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-white bg-gray-500 rounded-md"
                onClick={handleCloseModal}
              >
                No
              </button>
              <button
                className="px-4 py-2 text-white bg-red-600 rounded-md"
                onClick={() => {
                  if (usuarioAEliminar) {
                    handleDelete(usuarioAEliminar.id); // Asegúrate de pasar el ID correcto
                  }
                }}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
