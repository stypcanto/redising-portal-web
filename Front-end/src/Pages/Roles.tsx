import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react"; // Iconos de editar y eliminar
import axios from "axios";

// Definir la estructura del rol
interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]); // Estado con tipado

  useEffect(() => {
    // Llamada a la API para obtener los roles
    axios.get<Role[]>("http://localhost:5000/api/roles") // Asegurar el tipo de respuesta
      .then(response => setRoles(response.data))
      .catch(error => console.error("Error al obtener roles:", error));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-bold text-center text-[#1a2850]">Lista de Roles</h2>

      <table className="w-full border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">No.</th>
            <th className="p-2 border">Nombre del Rol</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Acción</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((rol, index) => (
              <tr key={rol.id} className="text-center border-b">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{rol.nombre}</td>
                <td className="p-2 border">{rol.descripcion}</td>
                <td className="flex justify-center p-2 space-x-2 border">
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-800">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">No hay roles disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
