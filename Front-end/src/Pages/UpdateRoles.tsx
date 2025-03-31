import { useEffect, useState, useCallback } from "react";
import { getRequest, putRequest } from "../Server/Api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/Modal/LoadingSpinner";
import { useNavigate } from "react-router-dom";

// Interfaces para tipado TypeScript
interface User {
  id: number;
  dni: string;
  nombres: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  rol: string;
  email?: string;
  telefono?: string;
}

interface ApiResponse {
  success: boolean;
  data: User[];
  total?: number;
}

// Constantes de configuración
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];
const ROLE_OPTIONS = ["Usuario", "Administrador", "Superadmin"];
const ALLOWED_ROLES = ["Administrador", "Superadmin"]; // ← Exactamente igual que en el backend// Roles con acceso a esta página

const UpdateRoles = () => {
  const navigate = useNavigate();
  
  // Estados del componente
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editedRoles, setEditedRoles] = useState<{ [key: number]: string }>({});
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof User; 
    direction: 'asc' | 'desc' 
  } | null>(null);

  /**
   * Verifica si el token JWT está expirado
   * @param token - Token JWT
   * @returns boolean - True si el token está expirado
   */
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true; // Si hay error al decodificar, considerar como expirado
    }
  };

  /**
   * Verifica la autenticación y permisos del usuario
   * @returns boolean - True si está autenticado y tiene permisos
   */
   const verifyAuth = (): boolean => {
    const token = localStorage.getItem("authToken");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("authToken");
      navigate('/login');
      return false;
    }
  
    // Decodifica el token para obtener el rol ACTUAL
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const currentRole = decoded.rol;
  
    if (!ALLOWED_ROLES.includes(currentRole)) {
      navigate('/unauthorized');
      return false;
    }
  
    return true;
  };

  /**
   * Obtiene la lista de usuarios desde el API
   */
 // En la función fetchUsers:
const fetchUsers = useCallback(async () => {
  if (!verifyAuth()) return;
  
  setLoading(true);
  setError("");
  
  try {
    const token = localStorage.getItem("authToken") || "";
    const response = await getRequest<ApiResponse>("/personal", token);
    
    if (!response?.success) {
      throw new Error(response?.message || "Error al obtener usuarios");
    }
    
    // Solución al error de tipado:
    const usersData = response.data && Array.isArray(response.data) 
      ? response.data 
      : [];
    setUsers(usersData);
    
  } catch (err: any) {
    console.error("Error fetching users:", err);
    setError(err.message);
    toast.error(err.message || "Error al cargar usuarios");
    
    if (err?.response?.status === 401) {
      localStorage.removeItem("authToken");
      navigate('/login');
    }
  } finally {
    setLoading(false);
  }
}, [navigate]);

  // Efecto inicial: Verificar autenticación y cargar datos
  useEffect(() => {
    if (verifyAuth()) {
      fetchUsers();
    }
  }, [fetchUsers]);

  /**
   * Maneja el cambio de items por página
   * @param e - Evento del select
   */
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  };

  /**
   * Cambia la página actual
   * @param page - Número de página
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Configura el ordenamiento de columnas
   * @param key - Columna a ordenar
   */
  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Aplicar ordenamiento
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filtrar y paginar usuarios
  const filteredUsers = sortedUsers.filter(user =>
    [user.dni, user.nombres, user.apellido_paterno, user.apellido_materno]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /**
   * Maneja el cambio de rol en un usuario
   * @param userId - ID del usuario
   * @param newRole - Nuevo rol asignado
   */
  const handleRoleChange = (userId: number, newRole: string) => {
    setEditedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  /**
   * Guarda el cambio de rol en el servidor
   * @param userId - ID del usuario a actualizar
   */
  const saveRoleChange = async (userId: number) => {
    if (!editedRoles[userId] || !verifyAuth()) return;
    
    try {
      const token = localStorage.getItem("authToken") || "";
      await putRequest("/admin/update-role", { 
        userId, 
        newRole: editedRoles[userId] 
      }, token);
      
      // Actualizar estado local
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, rol: editedRoles[userId] } : user
      ));
      
      // Limpiar edición
      setEditedRoles(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      
      toast.success("Rol actualizado correctamente");
    } catch (err: any) {
      console.error("Error updating role:", err);
      toast.error(err.message || "Error al actualizar rol");
      
      if (err?.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate('/login');
      }
    }
  };

  /**
   * Renderiza el ícono de ordenamiento
   * @param key - Columna actual
   * @returns JSX.Element - Ícono de flecha
   */
  const renderSortIcon = (key: keyof User) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Renderizado del componente
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Gestión de Roles de Usuario</h1>

        {/* Barra de búsqueda */}
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
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
        </div>

        {/* Tabla de usuarios */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['dni', 'nombres', 'apellido_paterno', 'rol'].map((key) => (
                    <th
                      key={key}
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                      onClick={() => requestSort(key as keyof User)}
                    >
                      {key.replace('_', ' ')} {renderSortIcon(key as keyof User)}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Nuevo Rol
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {user.dni}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {user.nombres}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {user.apellido_paterno || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.rol === 'Administrador' ? 'bg-green-100 text-green-800' :
                          user.rol === 'Superadmin' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <select
                          value={editedRoles[user.id] || user.rol}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {ROLE_OPTIONS.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={() => saveRoleChange(user.id)}
                          disabled={!editedRoles[user.id]}
                          className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
                            editedRoles[user.id] 
                              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" 
                              : "bg-gray-300 cursor-not-allowed"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        >
                          {editedRoles[user.id] ? "Guardar" : "Sin cambios"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-sm text-center text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col items-center justify-between mt-6 space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Mostrar</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="block w-20 py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="text-sm text-gray-700">por página</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de{' '}
                {filteredUsers.length} usuarios
              </span>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Anterior
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNum 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateRoles;