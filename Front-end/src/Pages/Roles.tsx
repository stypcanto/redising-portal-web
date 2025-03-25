import { useState, useEffect } from "react";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../components/Modal/ConfirmationModal";

interface Role {
  id: number;
  nombre: "Superadmin" | "Administrador" | "Usuario";
  descripcion: string;
  permisos?: string[];
}

const Roles = () => {
  // Datos iniciales de roles (almacenados en el frontend)
  const initialRoles: Role[] = [
    {
      id: 1,
      nombre: "Superadmin",
      descripcion: "Acceso completo a todas las funcionalidades del sistema",
      permisos: ["*"]
    },
    {
      id: 2,
      nombre: "Administrador",
      descripcion: "Administra usuarios y configuraciones básicas",
      permisos: ["users:manage", "settings:view"]
    },
    {
      id: 3,
      nombre: "Usuario",
      descripcion: "Acceso básico al sistema",
      permisos: ["dashboard:view"]
    }
  ];

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<Omit<Role, 'id'>>({ 
    nombre: "Usuario", 
    descripcion: "" 
  });

  // Cargar roles iniciales
  useEffect(() => {
    setLoading(true);
    // Simular carga de API
    setTimeout(() => {
      setRoles(initialRoles);
      setLoading(false);
    }, 500);
  }, []);

  // Manejar agregar rol
  const handleAddRole = () => {
    if (!newRole.nombre || !newRole.descripcion) {
      toast.error("Nombre y descripción son requeridos");
      return;
    }

    const roleToAdd = {
      ...newRole,
      id: Math.max(...roles.map(r => r.id), 0) + 1
    };

    setRoles([...roles, roleToAdd]);
    setShowAddModal(false);
    setNewRole({ nombre: "Usuario", descripcion: "" });
    toast.success("Rol agregado correctamente");
  };

  // Manejar editar rol
  const handleEditRole = () => {
    if (!selectedRole) return;

    setRoles(roles.map(role => 
      role.id === selectedRole.id ? selectedRole : role
    ));
    setShowEditModal(false);
    toast.success("Rol actualizado correctamente");
  };

  // Manejar eliminar rol
  const handleDeleteRole = () => {
    if (!selectedRole) return;

    setRoles(roles.filter(role => role.id !== selectedRole.id));
    setShowDeleteModal(false);
    toast.success("Rol eliminado correctamente");
  };

  // Obtener color basado en el rol
  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case "Superadmin":
        return "bg-purple-100 text-purple-800";
      case "Administrador":
        return "bg-blue-100 text-blue-800";
      case "Usuario":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Rol
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">No.</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Descripción</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role.nombre)}`}>
                          {role.nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{role.descripcion}</td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setShowEditModal(true);
                          }}
                          className="mr-4 text-yellow-600 hover:text-yellow-800"
                          title="Editar"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-sm text-center text-gray-500">
                      No hay roles disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para agregar rol */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h3 className="mb-4 text-lg font-bold">Agregar Nuevo Rol</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
              <select
                value={newRole.nombre}
                onChange={(e) => setNewRole({...newRole, nombre: e.target.value as Role["nombre"]})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Superadmin">Superadmin</option>
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={newRole.descripcion}
                onChange={(e) => setNewRole({...newRole, descripcion: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar rol */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h3 className="mb-4 text-lg font-bold">Editar Rol</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
              <select
                value={selectedRole.nombre}
                onChange={(e) => setSelectedRole({...selectedRole, nombre: e.target.value as Role["nombre"]})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Superadmin">Superadmin</option>
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={selectedRole.descripcion}
                onChange={(e) => setSelectedRole({...selectedRole, descripcion: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditRole}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      
      {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="p-6 bg-white rounded-lg shadow-lg w-96">
      <h3 className="mb-4 text-lg font-bold">Confirmar Eliminación</h3>
      <p className="mb-6 text-gray-700">
        ¿Estás seguro que deseas eliminar el rol "{selectedRole?.nombre}"? Esta acción no se puede deshacer.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleDeleteRole}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Roles;