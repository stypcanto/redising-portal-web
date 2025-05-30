import { useState, useEffect } from "react";
import { Pencil, Trash} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
//import ConfirmationModal from "../components/Modal/ConfirmationModal";

interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  permisos?: string[];
}



const initialRoles: Role[] = [
  {
    id: 1,
    nombre: "Superadmin",
    descripcion: "Acceso total a todas las funcionalidades y configuraciones del sistema.",
    permisos: ["*"]
  },
  {
    id: 2,
    nombre: "Administrador",
    descripcion: "Gestión de usuarios, roles y configuración general del sistema.",
    permisos: ["users:manage", "settings:view"]
  },
  {
    id: 3,
    nombre: "Coordinador Medico",
    descripcion: "Supervisa actividades médicas y gestiona al personal clínico.",
    permisos: ["users:manage", "settings:view"]
  },
  {
    id: 4,
    nombre: "Medico",
    descripcion: "Acceso a funciones clínicas esenciales y seguimiento de pacientes.",
    permisos: ["dashboard:view"]
  },
  {
    id: 5,
    nombre: "Coordinador Admision",
    descripcion: "Gestiona los procesos de admisión y coordina la atención inicial.",
    permisos: ["users:manage", "settings:view"]
  },
  {
    id: 6,
    nombre: "Admision",
    descripcion: "Realiza el registro y recepción de pacientes en el sistema.",
    permisos: ["dashboard:view"]
  },
  {
    id: 7,
    nombre: "Enfermera(o)",
    descripcion: "Acceso a herramientas para el cuidado y monitoreo del paciente.",
    permisos: ["dashboard:view"]
  },
  {
    id: 8,
    nombre: "Psicologa(o)",
    descripcion: "Acceso a funciones de evaluación y seguimiento psicológico.",
    permisos: ["dashboard:view"]
  },
  {
    id: 9,
    nombre: "Nutricionista",
    descripcion: "Acceso a módulos relacionados con evaluación y planes nutricionales.",
    permisos: ["dashboard:view"]
  },
  {
    id: 10,
    nombre: "Terapista de Lenguaje",
    descripcion: "Accede a herramientas para evaluación y sesiones de terapia del lenguaje.",
    permisos: ["dashboard:view"]
  },
  {
    id: 11,
    nombre: "Administrativo",
    descripcion: "Apoyo en tareas administrativas con acceso limitado al sistema.",
    permisos: ["dashboard:view"]
  },
  {
    id: 12,
    nombre: "Estadistico",
    descripcion: "Consulta de indicadores y generación de reportes estadísticos.",
    permisos: ["dashboard:view"]
  }
];

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Cargar roles iniciales
  useEffect(() => {
    setRoles(initialRoles);
  }, []);

  // Manejar editar rol
  const handleEditRole = () => {
    if (!selectedRole) return;

    setRoles(roles.map(role => 
      role.id === selectedRole.id ? selectedRole : role
    ));
    setShowEditModal(false);
    toast.success("Descripción actualizada correctamente");
  };

  // Manejar eliminar rol (con protección para Superadmin)
  const handleDeleteRole = () => {
    if (!selectedRole) return;

    if (selectedRole.nombre === "Superadmin") {
      toast.error("No se puede eliminar el rol Superadmin");
      return;
    }

    setRoles(roles.filter(role => role.id !== selectedRole.id));
    setShowDeleteModal(false);
    toast.success("Rol eliminado correctamente");
  };

  // Obtener color basado en el rol
  const roleColors: Record<string, string> = {
    Superadmin: "bg-purple-100 text-purple-800",
    Administrador: "bg-blue-100 text-blue-800",
    "Coordinador Medico": "bg-teal-100 text-teal-800",
    Medico: "bg-red-100 text-red-800",
    "Coordinador Admision": "bg-yellow-100 text-yellow-800",
    Admision: "bg-orange-100 text-orange-800",
    "Enfermera(o)": "bg-pink-100 text-pink-800",
    "Psicologa(o)": "bg-indigo-100 text-indigo-800",
    Nutricionista: "bg-green-100 text-green-800",
    "Terapista de Lenguaje": "bg-rose-100 text-rose-800",
    Administrativo: "bg-gray-100 text-gray-800",
    Estadistico: "bg-cyan-100 text-cyan-800",
    Usuario: "bg-green-100 text-green-800"
  };
  
  const getRoleColor = (roleName: string) => {
    return roleColors[roleName] || "bg-gray-100 text-gray-800";
  };
  



 
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
          <button
            onClick={() => toast.info("Los roles son predefinidos. Puedes editar las descripciones.")}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Instrucciones
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
                          title="Editar descripción"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (role.nombre === "Superadmin") {
                              toast.error("Este rol no puede eliminarse");
                              return;
                            }
                            setSelectedRole(role);
                            setShowDeleteModal(true);
                          }}
                          className={`${role.nombre === "Superadmin" 
                            ? "opacity-50 cursor-not-allowed" 
                            : "text-red-600 hover:text-red-800"}`}
                          title={role.nombre === "Superadmin" ? "Este rol no puede eliminarse" : "Eliminar"}
                          disabled={role.nombre === "Superadmin"}
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

      {/* Modal para editar rol */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h3 className="mb-4 text-lg font-bold">Editar Descripción del Rol</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
              <input
                value={selectedRole.nombre}
                readOnly
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
              />
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
      {showDeleteModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h3 className="mb-4 text-lg font-bold">Confirmar Eliminación</h3>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro que deseas eliminar el rol "{selectedRole.nombre}"? Esta acción no se puede deshacer.
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
