import { useEffect, useState } from "react";
import { getRequest, putRequest } from "../Server/Api";

interface User {
  id: number;
  dni: string;
  nombres: string;
  rol: string;
}

const SuperadminPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getRequest<{ data: User[] }>("/admin/users");
      setUsers(data.data); // ✅ Ahora TypeScript sabe que data tiene una propiedad "data"
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const updateRole = async (userId: number, newRole: string) => {
    try {
      await putRequest("/admin/update-role", { userId, newRole });
      fetchUsers();
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.dni}</td>
              <td>{user.nombres}</td>
              <td>
                <select value={user.rol} onChange={(e) => updateRole(user.id, e.target.value)}>
                  <option value="Usuario">Usuario</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Superadmin">Superadmin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuperadminPage;
