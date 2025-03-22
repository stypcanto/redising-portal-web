import { useEffect, useState } from "react";
import { getRequest, putRequest } from "../Server/Api";

interface User {
  id: number;
  dni: string;
  nombres: string;
  rol: string;
}

const UpdateRoles = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editedRoles, setEditedRoles] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("❌ No hay token en localStorage");
      return;
    }
    try {
      const data = await getRequest<{ data: User[] }>("/admin/users", token);
      setUsers(data.data);
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
    }
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setEditedRoles({ ...editedRoles, [userId]: newRole });
  };

  const saveRoleChange = async (userId: number) => {
    if (!editedRoles[userId]) return;
    try {
      await putRequest("/admin/update-role", { userId, newRole: editedRoles[userId] });
      setEditedRoles((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      fetchUsers();
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <h1 className="mb-4 text-lg font-bold text-center text-[#1a2850] sm:text-2xl">
        Gestión de Roles
      </h1>
      <div className="overflow-x-auto sm:overflow-visible">
        <table className="w-full text-xs text-center border border-collapse border-gray-300 sm:text-sm">
          <thead>
            <tr className="text-white bg-[#1a2850]">
              <th className="p-2 sm:p-3 whitespace-nowrap">DNI</th>
              <th className="p-2 sm:p-3 whitespace-nowrap">Nombre</th>
              <th className="p-2 sm:p-3">Rol</th>
              <th className="p-2 sm:p-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-300 hover:bg-gray-100">
                <td className="p-2 sm:p-3">{user.dni}</td>
                <td className="p-2 sm:p-3">{user.nombres}</td>
                <td className="p-2 sm:p-3">
                  <select
                    value={editedRoles[user.id] || user.rol}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Usuario">Usuario</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Superadmin">Superadmin</option>
                  </select>
                </td>
                <td className="p-2 sm:p-3">
                  <button
                    onClick={() => saveRoleChange(user.id)}
                    disabled={!editedRoles[user.id]}
                    className={`px-3 py-1 text-white rounded-lg shadow-md transition ${
                      editedRoles[user.id] ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
                    }`}
                  >
                    {editedRoles[user.id] ? "Actualizar" : "Registrado"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdateRoles;
