import { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react"; // Iconos para acciones
import { getRequest, deleteRequest } from "../Server/Api"; // Función para hacer GET y DELETE desde la API

// Definir la interfaz para la respuesta de la API
interface Usuario {
  id: number;
  nombres: string;
  apellido_paterno?: string;  // Hacer opcional
  apellido_materno?: string;  // Hacer opcional
  dni: string;
  rol: string;
}

interface ApiResponse {
  success: boolean;
  data: Usuario[];
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Tipar el estado de los usuarios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(""); // Para manejar errores y mostrar mensajes de error si es necesario
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

  useEffect(() => {
    let isMounted = true; // 🔹 Variable para controlar si el componente está montado
  
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("authToken");
      console.log("Token en localStorage:", token); // Verifica el token
      
      if (!token) {
        console.error("❌ No hay token en localStorage");
        setError("No estás autenticado");
        setLoading(false);
        return;
      }
  
      try {
        const response = await getRequest<ApiResponse>("/admin/users", token);
        console.log("Respuesta de la API:", response); // Verifica los datos que llegan
  
        if (response && response.success && Array.isArray(response.data)) {
          if (isMounted) {
            setUsuarios(response.data); // Establece los usuarios en el estado
            console.log("Usuarios obtenidos:", response.data); // Verifica que los usuarios se recibieron correctamente
          }
        } else {
          setError("Error al obtener usuarios: Respuesta inválida");
        }
      } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        setError("Error al obtener los usuarios");
      } finally {
        if (isMounted) {
          setLoading(false); // Cambia el estado de carga
        }
      }
    };
  
    fetchUsuarios();
  
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Función para manejar la apertura del modal
  const openModal = (usuario: Usuario) => {
    setUsuarioAEliminar(usuario);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioAEliminar(null);
  };

  // Función para eliminar el usuario
  const handleDelete = async (userId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No hay token en localStorage");
        return;
      }

      // Llamada a la API para eliminar al usuario
      const response = await deleteRequest(`/admin/delete-user/${userId}`, token);
      if (response.success) {
        // Si la eliminación fue exitosa, actualizamos la lista de usuarios
        setUsuarios((prevUsuarios) => prevUsuarios.filter((user) => user.id !== userId));
        setShowModal(false); // Cerramos el modal después de la eliminación
      } else {
        console.error("❌ Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("❌ Error en la eliminación:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-lg font-bold text-center text-[#1a2850]">
        Listado de Usuarios
      </h1>

      {/* ✅ Mostrar la tabla solo cuando hay datos */}
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
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
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
                    handleDelete(usuarioAEliminar.id);
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
