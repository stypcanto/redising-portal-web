import { useEffect, useState, useCallback } from "react";
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react";
import { getRequest, deleteRequest } from "../Server/Api";
import AddUsuarioModal from "../components/Modal/AddUsuarioModal";
import EditUsuarioModal from "../components/Modal/EditUsuarioModal";
import ViewUsuarioModal from "../components/Modal/ViewUsuarioModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/Modal/LoadingSpinner";
import ConfirmationModal from "../components/Modal/ConfirmationModal";

interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento?: string;
  sexo?: string;
  correo: string;
  telefono?: string;
  domicilio?: string;
  profesion?: string;
  especialidad?: string;
  colegiatura?: string;
  tipo_contrato?: string;
  rol: string;
  estado: boolean;
  fecha_registro: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Usuario[];
  total?: number;
  error?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [3, 5, 10, 20, 50, 100];

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Usuario;
    direction: "asc" | "desc";
  } | null>(null);

  // Función para cargar usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Obtener token de forma consistente
      const token = localStorage.getItem("token"); // Cambiado a "token" para ser consistente con el resto del código
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
  
      // 2. Hacer la petición con manejo de errores
      const response = await getRequest<ApiResponse>("/personal", token); // Cambiado a "/personal" que parece ser el endpoint correcto
      
      // 3. Validar respuesta
      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }
      
      if (!response.success) {
        throw new Error(response.message || "Error al obtener usuarios");
      }
  
      if (!Array.isArray(response.data)) {
        throw new Error("Formato de datos inválido");
      }
  
      // 4. Actualizar estado correctamente
      setUsuarios(response.data);
      
      // 5. Actualizar total si viene en la respuesta
      if (response.total !== undefined) {
        setTotalUsers(response.total);
      }
      
    } catch (err: unknown) {
      // 6. Mejor manejo de errores con TypeScript
      let errorMessage = "Error al cargar usuarios";
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Error fetching users:", err);
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Manejo de paginación
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Ordenamiento
  const requestSort = (key: keyof Usuario) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...usuarios];
  if (sortConfig) {
    sortedUsers.sort((a, b) => {
      if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Filtrado y paginación
  const filteredUsers = sortedUsers.filter((user) =>
    `${user.nombres} ${user.apellido_paterno} ${user.apellido_materno} ${user.dni} ${user.rol}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CRUD Operations
  const handleAddUser = (newUser: Usuario) => {
    setUsuarios([...usuarios, newUser]);
    toast.success("Usuario agregado correctamente");
    setShowAddModal(false);
  };

  const handleEditUser = (updatedUser: Usuario) => {
    setUsuarios(usuarios.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    toast.success("Usuario actualizado correctamente");
    setShowEditModal(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado");
        return;
      }
  
      // Usar la función deleteRequest del Api.ts
      const response = await deleteRequest(`/personal/${selectedUser.id}`, token);
  
      if (response?.success) {
        setUsuarios(usuarios.filter(user => user.id !== selectedUser.id));
        toast.success("Usuario eliminado correctamente");
        setShowDeleteModal(false);
      } else {
        throw new Error(response?.message || "Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error(error.message || "Error de conexión con el servidor");
      
      // Cerrar el modal incluso si hay error
      setSelectedUser(null);
      setShowDeleteModal(false);
    }
  };

  const renderSortIcon = (key: keyof Usuario) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>

        {/* Header with search and add button */}
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                    onClick={() => requestSort("nombres")}
                  >
                    Nombre {renderSortIcon("nombres")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                    onClick={() => requestSort("apellido_paterno")}
                  >
                    Apellido Paterno {renderSortIcon("apellido_paterno")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                    onClick={() => requestSort("dni")}
                  >
                    DNI {renderSortIcon("dni")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                    onClick={() => requestSort("rol")}
                  >
                    Rol {renderSortIcon("rol")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {user.nombres}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {user.apellido_paterno || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {user.dni}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.rol === "Admin"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                          className="mr-4 text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="mr-4 text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-sm text-center text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col items-center justify-between mt-6 space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Mostrar</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="block w-20 py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">por página</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                </span>{" "}
                de <span className="font-medium">{filteredUsers.length}</span> usuarios
              </span>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Anterior
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUsuarioModal
  showModal={showAddModal}
  handleClose={() => setShowAddModal(false)}
  onUserCreated={handleAddUser}  // <<-- Cambiado a onUserCreated
/>

      {selectedUser && (
        <>
          <EditUsuarioModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            userData={selectedUser}
            onSave={handleEditUser}
          />

          <ViewUsuarioModal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            userData={selectedUser}
          />

          <ConfirmationModal
            isOpen={showDeleteModal}
            onCancel={() => {
              setSelectedUser(null);
              setShowDeleteModal(false);
            }}
            onConfirm={handleDeleteUser}
            title="Confirmar eliminación"
            message={`¿Estás seguro que deseas eliminar al usuario ${selectedUser.nombres}?`}
          />
        </>
      )}
    </div>
  );
};

export default Usuarios;