import { useEffect, useState } from "react";
import { getRequest, putRequest } from "../Server/Api";
import { useNavigate } from "react-router-dom";
import Nav_admin from "../components/Nav/Nav_admin";
import Footer_azul from "../components/Footer/Footer_azul";

interface User {
  id: number;
  dni: string;
  nombres: string;
  rol: string;
}

const SuperadminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editedRoles, setEditedRoles] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Nav_admin />
      
      <main className="flex flex-col items-center flex-grow p-4 sm:p-6">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
          <h1 className="mb-4 text-lg font-bold text-center text-blue-900 sm:text-2xl">Gestión de Usuarios</h1>
          
          {/* Contenedor para hacer la tabla desplazable en móviles */}
          <div className="overflow-x-auto sm:overflow-visible">
            <table className="w-full text-xs text-center border border-collapse border-gray-300 sm:text-sm">
              <thead>
                <tr className="text-white bg-blue-900">
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
                        {editedRoles[user.id] ? "Guardar" : "Guardado"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-5 py-2 mt-6 text-base font-semibold text-white bg-red-600 rounded-lg shadow-md sm:text-lg hover:bg-red-700 sm:w-auto"
          >
            Cerrar sesión
          </button>
        </div>
      </main>

      <Footer_azul />
    </div>
  );
};

export default SuperadminPage;
